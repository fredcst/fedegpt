<?php

namespace App\Controller;

use App\Entity\Conversation;
use App\Entity\Message;
use App\Repository\ConversationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\BrowserKit\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request as HttpFoundationRequest;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


class ConversationController extends AbstractController
{
    #[Route('/api/conversation', name: 'create_conversation', methods: ['POST'])]
    public function createConversation(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser(); // Obtener el usuario autenticado
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], 401);
        }

        // Crear nueva conversación con la fecha actual
        $conversation = new Conversation($user);
        $entityManager->persist($conversation);
        $entityManager->flush();

        return new JsonResponse([
            'conversationId' => $conversation->getId(),
            'createdAt' => $conversation->getCreatedAt()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/message', name: 'create_message', methods: ['POST'])]
    public function createMessage(HttpFoundationRequest $request, EntityManagerInterface $entityManager, ConversationRepository $conversationRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $conversationId = $data['conversationId'] ?? null;
        $input = $data['input'] ?? '';

        if (!$conversationId || !$input) {
            return new JsonResponse(['error' => 'Invalid input or conversation ID'], 400);
        }

        // Buscar la conversación por ID
        $conversation = $conversationRepository->find($conversationId);
        if (!$conversation) {
            return new JsonResponse(['error' => 'Conversation not found'], 404);
        }

        // Crear nuevo mensaje
        $message = new Message($input, $conversation);
        $entityManager->persist($message);
        $entityManager->flush();

        return new JsonResponse([
            'messageId' => $message->getId(),
            'input' => $message->getInput(),
        ]);
    }

    #[Route('/api/v2/conversations', name: 'get_conversations', methods: ['GET'])]
    public function getConversations(ConversationRepository $conversationRepository): JsonResponse
    {
        $user = $this->getUser(); // Asumiendo que el usuario está autenticado
        $conversations = $conversationRepository->findBy(['user' => $user]);

        $response = [];
        foreach ($conversations as $conversation) {
            $response[] = [
                'id' => $conversation->getId(),
                'createdAt' => $conversation->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return new JsonResponse($response);
    }

    #[Route('/api/v2/conversations/{user_id}', name: 'get_conversations_by_user', methods: ['GET'])]
    public function getConversationsByUser(
        int $user_id, 
        ConversationRepository $conversationRepository, 
        UserRepository $userRepository
    ): JsonResponse {
        // Buscar al usuario por ID
        $user = $userRepository->find($user_id);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        // Obtener las conversaciones del usuario
        $conversations = $conversationRepository->findBy(['user' => $user]);

        // Construir la respuesta anidada
        $response = [];
        foreach ($conversations as $conversation) {
            $messages = [];
            foreach ($conversation->getMessages() as $message) {
                $messages[] = [
                    'input' => $message->getInput(),
                    'output' => $message->getOutput(),
                ];
            }

            $response[] = [
                'conversationId' => $conversation->getId(),
                'createdAt' => $conversation->getCreatedAt()->format('Y-m-d H:i:s'),
                'messages' => $messages,
            ];
        }

        return new JsonResponse($response);
    }

    #[Route('/api/v2/conversations/{id}', name: 'delete_conversation_by_id', methods: ['DELETE'])]
    public function deleteConversation(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Buscar la conversación por id
        $conversation = $entityManager->getRepository(Conversation::class)->find($id);

        if (!$conversation) {
            return new JsonResponse(['error' => 'Conversation not found'], Response::HTTP_NOT_FOUND);
        }

        // Eliminar la conversación
        $entityManager->remove($conversation);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Conversation deleted successfully'], Response::HTTP_OK);
    }
}