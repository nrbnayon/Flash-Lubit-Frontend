// lib\types.ts
export interface User {
  id: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  voiceId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Avatar {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  voiceName: string;
  voiceId: string;
  voice_options?: string;
  createdAt: Date;
}

export interface Message {
  id: string
  text: string
  sender: "left" | "right"
  timestamp: Date
  userId: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  participants: User[]
  createdAt: Date
  updatedAt: Date
}
