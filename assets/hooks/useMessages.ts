import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "../Interfaces";

const useMessages = (conversationId: number | undefined) => {
  const fetchMessages = async () => {
    if (!conversationId) return [];
    const res = await axios.get<Message[]>(
      `/api/v2/conversations/${conversationId}/messages`
    );
    return res.data;
  };

  return useQuery<Message[]>({
    queryKey: conversationId ? [conversationId, "messages"] : ["messages"],
    queryFn: fetchMessages,
  });
};

// export default useMessages;

// const useMessagesOld = (conversation: Conversation | null) => {
//   return useQuery<Message[]>(
//     ["messages", conversation?.id],
//     () => (conversation?.id ? useMessages(conversation.id) : []),
//     {
//       enabled: !!conversation?.id, // Only fetch if conversationId exists
//     }
//   );
// };

export default useMessages;
