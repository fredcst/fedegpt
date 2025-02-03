import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "../../Interfaces";

const useGetMessages = (conversationId: number | undefined) => {
  const fetchMessages = () => {
    if (conversationId)
      return axios
        .get<Message[]>(`/api/v2/conversations/${conversationId}/messages`)
        .then((res) => res.data);
    return [];
  };

  return useQuery({
    queryKey: ["conversation", conversationId, "messages"],
    queryFn: fetchMessages,
    placeholderData: keepPreviousData,
  });
};

export default useGetMessages;
