// lib/services/api.ts
import api from "@/lib/axios";
import { toast } from "sonner";

export interface SpeakPayload {
  conversation_id: string;
  text: string;
  sender_type: string;
  user_voice_name: string;
  ai_voice_name: string;
  reply_as: string;
  reply_text?: string;
}

interface SpeakResponse {
  reply: string;
  user_audio: string;
  ai_audio: string;
  conversation_id: string;
}

export const speakApi = async (
  payload: SpeakPayload
): Promise<SpeakResponse> => {
  try {
    const response = await api.post("/speak", payload);
    console.log("speakApi response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("speakApi error response:", error.response.data);
      toast.error(
        `Failed to send message: ${
          error.response.data.detail || "Unknown error"
        }`
      );
    } else {
      console.error("Error in speakApi:", error);
      toast.error("Failed to send message. Please try again.");
    }
    throw error;
  }
};

export interface Avatar {
  id: number;
  uid: string;
  side: string;
  avatar_name: string;
  voice_name: string;
  elevenlabs_voice_id: string;
  video: string;
  created_at: string;
  updated_at: string;
  status: string;
  voice_options?: string[];
}

export const getAvatarsApi = async (): Promise<Avatar[]> => {
  try {
    const response = await api.get("/avatar");
    console.log("getAvatarsApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getAvatarsApi:", error);
    toast.error("Failed to fetch avatars");
    throw error;
  }
};

interface SaveChatPayload {
  title: string;
  conversation_id: string;
}

export interface SavedChat {
  id: number;
  uid: string;
  title: string;
  conversation_id: string;
  chat: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export const saveChatApi = async (
  payload: SaveChatPayload
): Promise<SavedChat> => {
  try {
    const response = await api.post("/chat-history", payload);
    console.log("saveChatApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in saveChatApi:", error);
    toast.error("Failed to save chat");
    throw error;
  }
};

export const getSavedChatsApi = async (): Promise<SavedChat[]> => {
  try {
    const response = await api.get("/chat-history");
    console.log("getSavedChatsApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getSavedChatsApi:", error);
    toast.error("Failed to fetch saved chats");
    throw error;
  }
};

export interface SavedChatDetails {
  chat_history: SavedChat;
  title: string;
  conversation_id: string;
  chat_dict: Array<{ user?: string; ai?: string }>;
  audio_dict: Array<{ user?: string; ai?: string }>;
}

export const getSavedChatApi = async (
  uid: string
): Promise<SavedChatDetails> => {
  try {
    const response = await api.get(`/chat-history/${uid}`);
    console.log("getSavedChatApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getSavedChatApi:", error);
    toast.error("Failed to fetch saved chat details");
    throw error;
  }
};

interface ReplayDialoguePayload {
  conversation_id: string;
}

export interface ReplayDialogueResponse {
  conversation_id: string;
  chat_list: Array<{ user?: string; ai?: string }>;
  audio_list: Array<{ user?: string; ai?: string }>;
}

export const replayDialogueApi = async (
  payload: ReplayDialoguePayload
): Promise<ReplayDialogueResponse> => {
  try {
    const response = await api.post("/replay-dialogue", payload);
    console.log("replayDialogueApi full response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in replayDialogueApi:", error);
    toast.error("Failed to replay dialogue");
    throw error;
  }
};

// export const replayDialogueApi = async (
//   payload: ReplayDialoguePayload
// ): Promise<ReplayDialogueResponse> => {
//   try {
//     const response = await api.post("/replay-dialogue", payload);
//     console.log("replayDialogueApi response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error in replayDialogueApi:", error);
//     toast.error("Failed to replay dialogue");
//     throw error;
//   }
// };

interface AnalyzeTextPayload {
  text?: string;
  summary?: string | undefined;
}

export interface AnalyzeTextResponse {
  analysis?: string;
  text?: string;
  summary?: string | undefined;
}

export const analyzeTextApi = async (
  payload: AnalyzeTextPayload
): Promise<AnalyzeTextResponse> => {
  try {
    const response = await api.post("/analyze", payload);
    console.log("analyzeTextApi response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in analyzeTextApi:", error);
    toast.error("Failed to analyze text");
    throw error;
  }
};
