<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController
{
    #[Route('/api/some-endpoint', name: 'api_some_endpoint', methods: ['GET'])]
    public function someEndpoint(): JsonResponse
    {
        $data = [
            'message' => 'Hello from the API!',
            'success' => true
        ];
        return $this->json($data);
    }
}
