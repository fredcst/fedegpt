import React, { useState } from "react";

interface Conversation {
  id: number;
  name: string;
}

const Test = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();

  const createConversation = () => {
    let conv: Conversation = {
      id: conversations.length + 1,
      name: "",
    };
    setSelectedConversation(conv);
    return conv;
  };

  const handleClick = () => {
    if (!selectedConversation) {
      createConversation();
    }
    const updatedConversations = conversations.map((conv) => {
      if (conv.id == selectedConversation?.id) {
        return { ...conv, name: "Name Changed" };
      }
      return conv;
    });
    setConversations(updatedConversations);
  };

  return (
    <button onClick={handleClick}>Change Name of conversation to "test"</button>
  );
};

export default Test;
