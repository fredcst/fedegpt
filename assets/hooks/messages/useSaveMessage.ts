import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from "../../Interfaces";
import axios from "axios";

const useSaveMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      conversationId,
      numb,
    }: {
      message: Message;
      conversationId: number;
      numb: number;
    }) => {
      const newMessage = (
        await axios.post<Message>("/api/message", {
          conversationId: conversationId,
          input: message.input,
          output: message.output,
        })
      ).data;
      return { newMessage, conversationId, numb };
    },

    onSuccess: (response) => {
      queryClient.setQueryData(
        ["conversation", response?.conversationId, "messages"],
        (messages: Message[] = []) =>
          messages.map((message) =>
            message.id === -1
              ? { ...message, output: response?.newMessage.output, id: response?.newMessage.id }
              : message
          )
      )},

      onSettled: (response) => {
        queryClient.invalidateQueries({queryKey: ["conversation", response?.conversationId, "messages"]});
      },
  })
};

export default useSaveMessage;
