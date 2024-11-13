import { useQuery } from "@tanstack/react-query";
import { Conversation } from "../Interfaces";
import axios from "axios";

const useGetConversations = () => {
  const fetchConversations = () => {
    return axios
      .get<Conversation[]>("/api/v2/conversations")
      .then((res) => res.data);
  };

  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });
};

export default useGetConversations;
