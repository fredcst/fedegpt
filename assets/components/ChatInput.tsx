import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAddMessage from "../hooks/useAddMessage";
import { Conversation } from "../Interfaces";

interface Props {
  selectedConversation: Conversation | null;
}

const ChatInput = ({ selectedConversation }: Props) => {
  const [input, setInput] = useState<string>("");

  const queryClient = useQueryClient();

  const addMessage = useAddMessage(selectedConversation, input, () => {
    setInput("");
  });

  return (
    <>
      {addMessage.error && <p>{addMessage.error.message}</p>}
      <div style={{ width: "30%", padding: "10px" }}>
        {selectedConversation ? (
          <div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message"
            />
            <button
              onClick={() => {
                addMessage.mutate({
                  input: input,
                  output: "",
                });
              }}
            >
              Submit
            </button>
          </div>
        ) : (
          <p>Select a conversation to send a message</p>
        )}
      </div>
    </>
  );
};

export default ChatInput;
