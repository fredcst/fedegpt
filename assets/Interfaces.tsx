// Definir las interfaces para las conversaciones y mensajes
interface Conversation {
  id: number | undefined;
  createdAt: string;
}

interface Message {
  id: number;
  input: string;
  output: string;
}

interface ConnectedUser {
  name: string;
  lastName: string;
  uid: string;
}

export { Conversation, Message, ConnectedUser };
