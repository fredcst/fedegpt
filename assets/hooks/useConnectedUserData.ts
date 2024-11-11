import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ConnectedUser {
  name: string;
  lastName: string;
  uid: string;
}

const useConnectedUserData = () => {
  const fetchUser = () =>
    axios.get<ConnectedUser>("/api/me").then((res) => res.data);

  return useQuery<ConnectedUser, Error>({
    queryKey: ["data"],
    queryFn: fetchUser,
  });
};

export default useConnectedUserData;
