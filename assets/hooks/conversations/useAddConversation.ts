import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Conversation } from "../../Interfaces";
import axios from "axios";
import { useConversationStore } from "./useConversationStore";

const useAddConversation = () => {
  const queryClient = useQueryClient();
  const { setSelectedConversation } = useConversationStore();

  return useMutation({
    mutationFn: async () =>
      axios
        .post<Conversation>("/api/conversation")
        .then((response) => response.data),

    onSuccess: (newConversation) => {
      queryClient.setQueryData(
        ["conversations"],
        (oldConversations: any[] = []) => [...oldConversations, newConversation]
      );
      setSelectedConversation(newConversation);
    },
  });
};

export default useAddConversation;
