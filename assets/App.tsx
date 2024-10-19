import React from "react";
import { useState } from "react";
import axios from "axios";

function Conversation() {
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");

  const createConversation = async () => {
    try {
      const response = await axios.post("/api/conversation", {});
      if (response.data.conversationId) {
        setConversationId(response.data.conversationId);
      } else {
        console.error("Error creating conversation", response.data);
      }
    } catch (error) {
      console.error("Error creating conversation", error);
    }
  };

  const sendMessage = async () => {
    if (!input || !conversationId) return;

    try {
      // 1. Enviar el mensaje al backend
      const response = await axios.post("/api/message", {
        conversationId: conversationId,
        input: input,
      });

      const messageData = response.data;
      if (messageData.messageId) {
        console.log("Message sent:", messageData);

        // 2. Hacer la consulta a la API externa
        const externalResponse = await axios.get(
          "https://jsonplaceholder.typicode.com/todos/1"
        );
        const title = externalResponse.data.title;

        // 3. Enviar el 'title' al backend para actualizar la fila en Message
        await axios.put(`/api/message/${messageData.messageId}/update-output`, {
          output: title,
        });

        setInput(""); // Limpiar el textarea después de enviar el mensaje
      } else {
        console.error("Error sending message", messageData);
      }
    } catch (error) {
      console.error("Error sending message or fetching external API", error);
    }
  };

  return (
    <div>
      {!conversationId ? (
        <button onClick={createConversation}>Start Conversation</button>
      ) : (
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={sendMessage}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Conversation;
