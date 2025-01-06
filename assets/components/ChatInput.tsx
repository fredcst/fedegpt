import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAddMessage from "../hooks/useAddMessage";
import { Conversation } from "../Interfaces";

interface Props {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation) => void;
}

const ChatInput = ({
  selectedConversation,
  setSelectedConversation,
}: Props) => {
  const [input, setInput] = useState<string>("");

  const {
    mutate: addMessage,
    isLoading,
    error,
  } = useAddMessage(
    selectedConversation,
    input,
    () => {
      setInput("");
    },
    setSelectedConversation
  );

  return (
    <>
      {/* {addMessage && <p>{error.message}</p>} */}
      <div style={{ width: "30%", padding: "10px" }}>
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
          />
          <button
            onClick={() => {
              addMessage({
                input: input,
                output: "",
              });
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
