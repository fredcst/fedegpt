import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Conversation, Message } from "../Interfaces";
import { useConversations } from "./useConversations";

const useAddMessage = (
  selectedConversation,
  input,
  onAdd: () => void,
  setSelectedConversation: (conversation: Conversation) => void
) => {
  const queryClient = useQueryClient();
  const { createConversation } = useConversations();

  const mutation = useMutation<{ messageId: number }, Error, Message>({
    mutationFn: async (message: Message) => {
      let conversationId = selectedConversation?.id;

      if (!conversationId) {
        const newConversation = await new Promise<Conversation>(
          (resolve, reject) => {
            createConversation(undefined, {
              onSuccess: (data) => resolve(data),
              onError: (error) => reject(error),
            });
          }
        );

        conversationId = newConversation.id;

        setSelectedConversation(newConversation);
      }

      return axios
        .post<{ messageId: number }>("/api/message", {
          conversationId,
          input,
        })
        .then((res) => res.data);
    },
    onSuccess: async (savedMessage) => {
      const externalResponse = await axios.post<{ title: string }>(
        "https://dummyjson.com/posts/add",
        {
          title: input,
          userId: 5,
        }
      );

      const answer =
        "You have received an answer: " + externalResponse.data.title;

      await axios.put(`/api/message/${savedMessage.messageId}/update-output`, {
        output: answer,
      });

      queryClient.setQueryData<Message[]>(
        [selectedConversation?.id, "messages"],
        (messages = []) => [{ input: input, output: answer }, ...messages]
      );
      onAdd();
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isLoading,
  };
};

export default useAddMessage;
