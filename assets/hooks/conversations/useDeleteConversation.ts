import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const useDeleteConversation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (conversationId: number | undefined) => {
            if (!conversationId) {
                throw new Error("Invalid conversation ID");
            }
            return axios
                .delete(`/api/v2/conversations/${conversationId}/`)
                .then((res) => res.data);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(["conversations"]);
        },
        onError: (error) => {
            console.error("Error deleting conversation:", error);
        }
    });
};

export default useDeleteConversation;