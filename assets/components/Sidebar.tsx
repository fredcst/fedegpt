import React from "react";
import GetUser from "./GetUser";
import axios from "axios";
import { Conversation, Message, ConnectedUser } from "../Interfaces";
import useGetConversations from "../hooks/useGetConversations";

interface Props {
  setMessages: (messages: Message[]) => void;
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void; // Allow `null`
}

const Sidebar = ({
  setMessages,
  conversations,
  setConversations,
  setSelectedConversation,
  selectedConversation,
}: Props) => {
  const { data } = useGetConversations();

  const loadMessages = (conversationId: number) => {
    axios
      .get<Message[]>(`/api/v2/conversations/${conversationId}/messages`)
      .then((response) => {
        setMessages(response.data);
      });
  };

  const createConversation = () => {
    axios
      .post<Conversation>("/api/conversation", {})
      .then((response) => {
        if (response.data.id) {
          setConversations([...conversations, response.data]);
          setSelectedConversation(response.data);
          loadMessages(response.data.id);
        }
      })
      .catch((error) => {
        console.error("Error creating conversation:", error);
        // Handle error (e.g., show a notification or alert)
      });
  };

  const deleteConversation = (conversationId: number) => {
    axios
      .delete(`/api/v2/conversations/${conversationId}`)
      .then(() => {
        setConversations(conversations.filter((c) => c.id !== conversationId));
        setMessages([]); // Clear messages if the selected conversation was deleted
        setSelectedConversation(null); // Deselect the conversation
      })
      .catch((error) => {
        console.error("Error deleting conversation:", error);
        // Handle error (e.g., show a notification or alert)
      });
  };

  return (
    <div
      style={{
        width: "30%",
        borderRight: "1px solid black",
        padding: "10px",
      }}
    >
      {/* <h2>Hello {connectedUser?.name} !</h2> */}
      <h2>Hello !</h2>
      <GetUser />
      <h3>Conversations</h3>
      <button onClick={createConversation}>Start New Conversation</button>
      <ul>
        {data?.map((conversation) => (
          <li key={conversation.id}>
            <span
              onClick={() => {
                setSelectedConversation(conversation);
                loadMessages(conversation.id);
              }}
              style={{
                cursor: "pointer",
                fontWeight:
                  selectedConversation?.id === conversation.id
                    ? "bold"
                    : "normal",
              }}
            >
              Conversation {conversation.id} - {conversation.createdAt}
            </span>
            <button onClick={() => deleteConversation(conversation.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
