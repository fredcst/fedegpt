import { create } from "zustand";
import { Message } from "../../Interfaces";

interface MessagesStore {
  messages: Record<number, Message[]>; // Guarda mensajes por conversación
  setMessages: (conversationId: number, messages: Message[]) => void;
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  messages: {},
  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),
}));
