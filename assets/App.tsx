import React, { useState } from "react";
import { useConversationStore } from "./hooks/conversations/useConversationStore";
import useGetConversations from "./hooks/conversations/useGetConversations";
import useGetMessages from "./hooks/messages/useGetMessages";
import useAddConversation from "./hooks/conversations/useAddConversation";
import useAddMessage from "./hooks/messages/useAddMessage";
import useSaveMessage from "./hooks/messages/useSaveMessage";
import useDeleteConversation from "./hooks/conversations/useDeleteConversation";

const App = () => {
  const [input, setInput] = useState("");
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const { data: conversations } = useGetConversations();
  const { data: messages } = useGetMessages(selectedConversation?.id);
  const addConversation = useAddConversation();
  const addMessage = useAddMessage();
  const saveMessage = useSaveMessage();

  const handleSend = () => {
    if (!selectedConversation) {
      addConversation.mutate(undefined, {
        onSuccess: (newConversation) => {
          sendMessage(newConversation.id);
        },
      });
    } else {
      console.log("sendMessageSelectedConversation");
      sendMessage(selectedConversation.id);
    }
  };
  
  const sendMessage = async (conversationId: number | undefined) => {
    if (!conversationId) return;
    addMessage.mutate({
      message: { id: -1, input, output: "" },
      conversationId: conversationId,
    });
  
    const output = await new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("lorem ipsum dolor sit amet, consectetur adip");
      }, 3000);
    });
  
    const newId = Math.random(); 
    saveMessage.mutate({
      message: { id: newId, input: input, output: output },
      conversationId,
      numb: newId, 
    });
  };

  return (
    <>
      <button onClick={() => addConversation.mutate()}>New conversation</button>
      <button onClick={() => setSelectedConversation()}>
        Deselect conversation
      </button>
      {conversations &&
        conversations.map((conv, index) => (
          <span key={index}>
            <span
              onClick={() => setSelectedConversation(conv)}
              style={{ paddingRight: "20px" }}
            >
              {conv.id} : {conv.createdAt}
            </span>
            <span>
                {/* <button onClick={() => deleteConversation.mutate(conv.id)}>
                  Delete
                </button> */}
              </span>
            </span>
        ))}
      <hr></hr>
      <span>
        {selectedConversation && (
          <h4>Selected Conversation : {selectedConversation.createdAt}</h4>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </span>
      <div>
        {messages &&
          messages.map((message, index) => (
            <div key={index} style={{ display: "flex", gap: "30px" }}>
              <span>Message ID : {message.id}</span>
              <span>INPUT : {message.input}</span>
              <span>OUTPUT: {message.output}</span>
            </div>
          ))}
      </div>
    </>
  );
};

export default App;
