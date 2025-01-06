import React from "react";
import GetUser from "./GetUser";
import axios from "axios";
import { Conversation, Message, ConnectedUser } from "../Interfaces";
import useGetConversations from "../hooks/useGetConversations";
import { useConversations } from "../hooks/useConversations";

interface Props {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
}

const Sidebar = ({ setSelectedConversation, selectedConversation }: Props) => {
  const { data: conversations } = useGetConversations();

  const { createConversation, deleteConversation } = useConversations();

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
      <button onClick={() => createConversation()}>
        Start New Conversation
      </button>
      <ul>
        {conversations?.map((conversation) => (
          <li key={conversation.id}>
            <span
              onClick={() => {
                setSelectedConversation(conversation);
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
