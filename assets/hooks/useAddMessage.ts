import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "../Interfaces";

const useAddMessage = (selectedConversation, input, onAdd: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<{ messageId: number }, Error, Message>({
    mutationFn: (message: Message) => {
      return axios
        .post<{ messageId: number }>("/api/message", {
          conversationId: selectedConversation?.id,
          input: input,
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
};

export default useAddMessage;
