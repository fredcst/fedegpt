// /hooks/useConversations.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Conversation } from "../Interfaces";

// Fetch Conversations
const fetchConversations = async () => {
  const response = await axios.get("/api/conversations");
  return response.data;
};

// Create Conversation
const createConversation = async () => {
  const response = await axios.post("/api/conversation", {});
  return response.data;
};

// Delete Conversation
const deleteConversation = async (conversationId: number) => {
  await axios.delete(`/api/v2/conversations/${conversationId}`);
};

export const useConversations = () => {
  const queryClient = useQueryClient();

  // Fetching conversations
  const {
    data: conversations,
    isLoading,
    isError,
  } = useQuery(["conversations"], fetchConversations);

  // Mutation for creating a conversation
  const createMutation = useMutation(createConversation, {
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]); // Invalidate conversations list after creation
    },
  });

  // Mutation for deleting a conversation
  const deleteMutation = useMutation(deleteConversation, {
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]); // Invalidate conversations list after deletion
    },
  });

  return {
    conversations,
    isLoading,
    isError,
    createConversation: createMutation.mutate,
    deleteConversation: deleteMutation.mutate,
  };
};
