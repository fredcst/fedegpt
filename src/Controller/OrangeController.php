<?php

namespace App\Controller;

use App\Entity\Orange;
use App\Form\OrangeType;
use App\Repository\OrangeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/orange')]
final class OrangeController extends AbstractController
{
    #[Route(name: 'app_orange_index', methods: ['GET'])]
    public function index(OrangeRepository $orangeRepository): Response
    {
        return $this->render('orange/index.html.twig', [
            'oranges' => $orangeRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_orange_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $orange = new Orange();
        $form = $this->createForm(OrangeType::class, $orange);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($orange);
            $entityManager->flush();

            return $this->redirectToRoute('app_orange_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('orange/new.html.twig', [
            'orange' => $orange,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_orange_show', methods: ['GET'])]
    public function show(Orange $orange): Response
    {
        return $this->render('orange/show.html.twig', [
            'orange' => $orange,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_orange_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Orange $orange, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(OrangeType::class, $orange);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_orange_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('orange/edit.html.twig', [
            'orange' => $orange,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_orange_delete', methods: ['POST'])]
    public function delete(Request $request, Orange $orange, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$orange->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($orange);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_orange_index', [], Response::HTTP_SEE_OTHER);
    }
}
