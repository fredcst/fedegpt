import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Conversation } from "../../Interfaces";

const useGetConversations = () => {
  const fetchConversations = () =>
    axios.get<Conversation[]>("/api/v2/conversations").then((res) => res.data);

  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });
};

export default useGetConversations;
