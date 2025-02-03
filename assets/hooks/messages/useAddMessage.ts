import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Conversation, Message } from "../../Interfaces";

const useAddMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      conversationId,
    }: {
      message: Message;
      conversationId: number;
    }) => {
      return { message, conversationId };
    },

    onMutate: (response) => {
      queryClient.setQueryData(
        ["conversation", response.conversationId, "messages"],
        (oldMessages: Message[] = []) => [...oldMessages, response.message]
      );
      console.log(queryClient.getQueryData(["conversation", response.conversationId, "messages"]));
    },

    onSuccess: (response) => {
      // queryClient.invalidateQueries({ queryKey: ["conversation", response?.conversationId, "messages"] });
      // console.log(queryClient.getQueryData(["conversation", response?.conversationId, "messages"]));
    },
  });
};


export default useAddMessage;
