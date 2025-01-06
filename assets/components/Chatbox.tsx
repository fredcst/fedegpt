import React from "react";
import { Conversation, Message, ConnectedUser } from "../Interfaces";
import useMessages from "../hooks/useMessages";

interface Props {
  selectedConversation: Conversation | null;
}

const Chatbox = ({ selectedConversation }: Props) => {
  const { data, isLoading, isError } = useMessages(selectedConversation?.id);
  return (
    <div
      style={{
        width: "40%",
        borderRight: "1px solid black",
        padding: "10px",
      }}
    >
      <h3>Messages</h3>
      {selectedConversation ? (
        <ul>
          {data?.map((message, index) => (
            <li key={index}>
              <strong>Input:</strong> {message.input}
              <br />
              <strong>Output:</strong> {message.output}
            </li>
          ))}
        </ul>
      ) : (
        <p>Select a conversation to see messages</p>
      )}
    </div>
  );
};

export default Chatbox;
