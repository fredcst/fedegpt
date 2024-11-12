import React, { useState } from "react";
import { Conversation, Message, ConnectedUser } from "../Interfaces";
import axios from "axios";

interface Props {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void; // Allow `null`
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const ChatInput = ({
  setMessages,
  messages,
  conversations,
  setConversations,
  setSelectedConversation,
  setLoading,
  selectedConversation,
  loading,
}: Props) => {
  const [input, setInput] = useState<string>("");

  const sendMessage = async () => {
    if (!input || !selectedConversation) return;

    setLoading(true); // Mostrar el spinner al iniciar el envío

    try {
      // Enviar el mensaje al backend
      const response = await axios.post<{ messageId: number }>("/api/message", {
        conversationId: selectedConversation.id,
        input: input,
      });

      const messageData = response.data;
      if (messageData.messageId) {
        // Hacer la consulta a la API externa
        const externalResponse = await axios.post<{ title: string }>(
          "https://dummyjson.com/posts/add",
          {
            title: input,
            userId: 5,
          }
        );
        const title = "You have answered :" + externalResponse.data.title;

        // Actualizar la fila en Message con el title como output
        await axios.put(`/api/message/${messageData.messageId}/update-output`, {
          output: title,
        });
        // Actualizar la lista de mensajes con el nuevo mensaje
        setMessages([...messages, { input, output: title }]);
        setInput("");
        // setError(null); // Limpiar el error si la solicitud fue exitosa
      } else {
        // setError("Error sending message");
      }
    } catch (error) {
      //   setError("Error sending message or fetching external API");
    } finally {
      setLoading(false); // Ocultar el spinner después de completar el proceso
    }
  };

  return (
    <div style={{ width: "30%", padding: "10px" }}>
      {selectedConversation ? (
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
          />
          {loading && <p>Sending message...</p>}
          <button onClick={sendMessage}>Submit</button>
        </div>
      ) : (
        <p>Select a conversation to send a message</p>
      )}
    </div>
  );
};

export default ChatInput;
