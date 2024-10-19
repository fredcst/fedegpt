<?php

// src/Controller/ConversationController.php
namespace App\Controller;

use App\Entity\Conversation;
use App\Entity\Message;
use App\Repository\ConversationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class ConversationController extends AbstractController
{
    #[Route('/api/conversation', name: 'create_conversation', methods: ['POST'])]
    public function createConversation(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], 401);
        }

        // Crear nueva conversación con la fecha actual
        $conversation = new Conversation();
        $conversation->setUser($this->getUser());
        $entityManager->persist($conversation);
        $entityManager->flush();

        return new JsonResponse([
            'conversationId' => $conversation->getId(),
            'createdAt' => $conversation->getCreatedAt()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/message', name: 'create_message', methods: ['POST'])]
    public function createMessage(Request $request, EntityManagerInterface $entityManager, ConversationRepository $conversationRepository): JsonResponse
    {
        // Decodificar el contenido JSON de la solicitud
        $data = json_decode($request->getContent(), true);
    
        // Validar que el conversationId exista en el array y no esté vacío
        if (!isset($data['conversationId']) || !$data['conversationId']) {
            return new JsonResponse(['error' => 'Invalid conversation ID'], 400);
        }
    
        // Validar que el input no esté vacío
        $input = $data['input'] ?? '';
        if (empty($input)) {
            return new JsonResponse(['error' => 'Input cannot be empty'], 400);
        }
    
        $conversationId = $data['conversationId'];
    
        // Buscar la conversación por ID
        $conversation = $conversationRepository->find($conversationId);
        if (!$conversation) {
            return new JsonResponse(['error' => 'Conversation not found'], 404);
        }
    
        // Crear nuevo mensaje
        $message = new Message();
        $message->setInput($input);
        $message->setConversation($conversation);
        $entityManager->persist($message);
        $entityManager->flush();
    
        return new JsonResponse([
            'messageId' => $message->getId(),
            'input' => $message->getInput(),
        ]);
    }
}