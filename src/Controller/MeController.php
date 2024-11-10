<?php 

// src/Controller/MeController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Entity\User;

class MeController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function __invoke(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'No hay un usuario conectado'], 401);
        }

        // Recuperar las propiedades personalizadas de tu entidad User
        $email = $user->getEmail();
        $name = $user->getName(); 
        $lastname = $user->getLastname(); 
        $uid = $user->getUid(); 


        return new JsonResponse([
            'email' => $email,
            'name' => $name,
            'lastname' => $lastname,
            'uid' => $uid,
        ]);
    }
}
