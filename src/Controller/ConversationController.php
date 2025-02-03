<?php

namespace App\Controller;

use App\Entity\Conversation;
use App\Entity\Message;
use App\Repository\ConversationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request as HttpFoundationRequest;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
            'id' => $conversation->getId(),
            'createdAt' => $conversation->getCreatedAt()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/message', name: 'create_message', methods: ['POST'])]
    public function createMessage(HttpFoundationRequest $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $conversationId = $data['conversationId'] ?? null;
        $input = $data['input'] ?? '';
        $output = $data['output'] ?? '';
    
        if (!$conversationId || !$input) {
            return new JsonResponse(['error' => 'Invalid input or conversation ID'], 400);
        }
    
        $conversation = $entityManager->getRepository(Conversation::class)->find($conversationId);
        
        if (!$conversation) {
            return new JsonResponse(['error' => 'Conversation not found'], 404);
        }
    
        // Crear un nuevo mensaje y asociarlo con la conversación
        $message = new Message();
        $message->setInput($input);
        $message->setOutput($output);
        $message->setConversation($conversation);
        $entityManager->persist($message);
        $entityManager->flush();
    
        return new JsonResponse([
            'conversationId' => $conversation->getId(),
            'id' => $message->getId(),
            'input' => $message->getInput(),
            'output' => $message->getOutput(),
            'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/message_stream', name: 'create_message_stream', methods: ['GET'])]
    public function createMessageStram(HttpFoundationRequest $request): StreamedResponse
    {
        $data = json_decode($request->getContent(), true);
        $conversationId = $data['conversationId'] ?? null;
        $input = $data['input'] ?? '';
    
        if (!$conversationId || !$input) {
            return new StreamedResponse(function () {
                echo json_encode(['error' => 'Invalid input or conversation ID']);
            }, 400);
        }
    
        $client = HttpClient::create();
    
        // Configurar la respuesta streameada para enviar datos en tiempo real
        $streamedResponse = new StreamedResponse(function () use ($client) {
            try {
                // Realizar la solicitud al servidor Node.js
                $response = $client->request('GET', 'http://localhost:4000/');
                $stream = $client->stream($response);
    
                foreach ($stream as $chunk) {
                    echo $chunk->getContent(); // Enviar contenido del chunk al cliente
                    ob_flush();
                    flush(); // Forzar el envío del contenido al cliente
                }
            } catch (\Exception $e) {
                echo json_encode(['error' => 'Error streaming from server: ' . $e->getMessage()]);
            }
        });
    
        // Configurar las cabeceras necesarias para la respuesta streameada
        $streamedResponse->headers->set('Content-Type', 'text/plain');
        $streamedResponse->headers->set('Transfer-Encoding', 'chunked');
    
        return $streamedResponse;
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