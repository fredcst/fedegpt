// Definir las interfaces para las conversaciones y mensajes
interface Conversation {
  id: number;
  createdAt: string;
}

interface Message {
  input: string;
  output: string;
}

interface ConnectedUser {
  name: string;
  lastName: string;
  uid: string;
}

export { Conversation, Message, ConnectedUser };
