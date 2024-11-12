import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import ChatInput from "./components/ChatInput";
import Chatbox from "./components/Chatbox";
import Sidebar from "./components/Sidebar";
import { Conversation, Message, ConnectedUser } from "./Interfaces";

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [error, setError] = useState<string | null>(null); // Nuevo estado para errores
  const [loading, setLoading] = useState<boolean>(false);

  const [connectedUser, setConnectedUser] = useState<ConnectedUser | null>(
    null
  );

  useEffect(() => {
    const fetchConnectedUser = async () => {
      try {
        const response = await axios.get<ConnectedUser>("/api/me");
        setConnectedUser({
          name: response.data.name,
          lastName: response.data.lastName,
          uid: response.data.uid,
        });
        setError(null); // Limpiar el error si la solicitud fue exitosa
      } catch (error) {
        setError("Error fetching conversations"); // Guardar el error
      }
    };

    const fetchConversations = async () => {
      try {
        const response = await axios.get<Conversation[]>(
          "/api/v2/conversations"
        );
        setConversations(response.data);
        setError(null); // Limpiar el error si la solicitud fue exitosa
      } catch (error) {
        setError("Error fetching conversations"); // Guardar el error
      }
    };
    fetchConnectedUser();
    fetchConversations();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        conversations={conversations}
        setConversations={setConversations}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        messages={messages}
        setMessages={setMessages}
      />
      <Chatbox
        messages={messages}
        selectedConversation={selectedConversation}
      />
      <ChatInput
        conversations={conversations}
        setConversations={setConversations}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        messages={messages}
        setMessages={setMessages}
        loading={loading}
        setLoading={setLoading} // Fix: corrected the typo
      />
      {/* Mostrar errores */}
      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default App;
