<?php 

namespace App\Controller;

use App\Entity\Message;
use App\Repository\ConversationRepository;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class MessageController extends AbstractController
{
    #[Route('/api/message/{id}/update-output', name: 'update_message_output', methods: ['PUT'])]
    public function updateMessageOutput(int $id, Request $request, MessageRepository $messageRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $message = $messageRepository->find($id);

        if (!$message) {
            return new JsonResponse(['error' => 'Message not found'], 404);
        }

        // Obtener el 'output' del request body
        $data = json_decode($request->getContent(), true);
        $output = $data['output'] ?? null;

        if (!$output) {
            return new JsonResponse(['error' => 'Output is required'], 400);
        }

        // Actualizar el campo 'output' en la entidad Message
        $message->setOutput($output);
        $entityManager->persist($message);
        $entityManager->flush();

        return new JsonResponse(['success' => true, 'message' => 'Output updated successfully']);
    }

    #[Route('/api/conversations/{conversationId}/messages', name: 'get_messages', methods: ['GET'])]
    public function getMessages(int $conversationId, MessageRepository $messageRepository): JsonResponse
    {
        $messages = $messageRepository->findBy(['conversation' => $conversationId]);

        $response = [];
        foreach ($messages as $message) {
            $response[] = [
                'input' => $message->getInput(),
                'output' => $message->getOutput(),
            ];
        }

        return new JsonResponse($response);
    }
    
    #[Route('/api/conversations', name: 'get_conversations', methods: ['GET'])]
    public function getConversations(ConversationRepository $conversationRepository): JsonResponse
    {
        $user = $this->getUser();
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
}