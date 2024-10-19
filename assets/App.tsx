import React, { useState, useEffect } from "react";
import axios from "axios";

// Definir las interfaces para las conversaciones y mensajes
interface Conversation {
  id: number;
  createdAt: string;
}

interface Message {
  input: string;
  output: string;
}

function Conversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Nuevo estado para errores
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar las conversaciones al iniciar el componente
  useEffect(() => {
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

    fetchConversations();
  }, []);

  // Cargar los mensajes de la conversación seleccionada
  const loadMessages = async (conversationId: number) => {
    try {
      const response = await axios.get<Message[]>(
        `/api/v2/conversations/${conversationId}/messages`
      );
      setMessages(response.data);
      setError(null); // Limpiar el error si la solicitud fue exitosa
    } catch (error) {
      setError("Error fetching messages");
    }
  };

  const createConversation = async () => {
    try {
      const response = await axios.post<Conversation>("/api/conversation", {});
      if (response.data.id) {
        setConversations([...conversations, response.data]);
        setError(null); // Limpiar el error si la solicitud fue exitosa
      } else {
        setError("Error creating conversation");
      }
    } catch (error) {
      setError("Error creating conversation");
    }
  };

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
        const externalResponse = await axios.get<{ title: string }>(
          "https://jsonplaceholder.typicode.com/todos/" +
            Math.floor(Math.random() * 100)
        );
        const title = externalResponse.data.title;

        // Actualizar la fila en Message con el title como output
        await axios.put(`/api/message/${messageData.messageId}/update-output`, {
          output: title,
        });

        // Actualizar la lista de mensajes con el nuevo mensaje
        setMessages([...messages, { input, output: title }]);
        setInput("");
        setError(null); // Limpiar el error si la solicitud fue exitosa
      } else {
        setError("Error sending message");
      }
    } catch (error) {
      setError("Error sending message or fetching external API");
    } finally {
      setLoading(false); // Ocultar el spinner después de completar el proceso
    }
  };

  const deleteConversation = async (conversationId: number) => {
    try {
      await axios.delete(`/api/v2/conversations/${conversationId}`);
      // Eliminar la conversación de la lista de conversaciones en el estado
      setConversations(conversations.filter((c) => c.id !== conversationId));
      setMessages([]); // Limpiar los mensajes si se eliminó la conversación seleccionada
      setSelectedConversation(null); // Deseleccionar la conversación
    } catch (error) {
      setError("Error deleting conversation");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "30%",
          borderRight: "1px solid black",
          padding: "10px",
        }}
      >
        <h3>Conversations</h3>
        <button onClick={createConversation}>Start New Conversation</button>
        <ul>
          {conversations.map((conversation) => (
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
            {messages.map((message, index) => (
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

      {/* Mostrar errores */}
      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default Conversation;
