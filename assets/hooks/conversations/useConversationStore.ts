import { Conversation } from "../../Interfaces";
import { create } from "zustand";

interface ConversationStore {
  selectedConversation?: Conversation;
  setSelectedConversation: (conversation?: Conversation) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  selectedConversation: undefined,
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
}));
