import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "../Interfaces";

const fetchMessages = async (conversationId: number): Promise<Message[]> => {
  const response = await axios.get(
    `/api/v2/conversations/${conversationId}/messages`
  );
  return response.data;
};

const useMessages = (conversationId: number | null) => {
  return useQuery<Message[]>(
    ["messages", conversationId],
    () => (conversationId ? fetchMessages(conversationId) : []),
    {
      enabled: !!conversationId, // Only fetch if conversationId exists
    }
  );
};

export default useMessages;
