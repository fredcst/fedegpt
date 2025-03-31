<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Twig\Environment;

class NotFoundListener
{
    private Environment $twig;

    public function __construct(Environment $twig)
    {
        $this->twig = $twig;
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        // Solo capturar errores 404
        if (!$exception instanceof NotFoundHttpException) {
            return;
        }

        $request = $event->getRequest();
        $path = $request->getPathInfo();

        // Evitar redirigir APIs y EasyAdmin
        if (str_starts_with($path, '/api') || str_starts_with($path, '/admin')) {
            return;
        }

        // Renderizar React en rutas desconocidas
        $response = new Response($this->twig->render('base.html.twig'), Response::HTTP_OK);
        $event->setResponse($response);
    }
}