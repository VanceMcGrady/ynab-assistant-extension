import { v4 as uuidv4 } from "uuid";
import type { AIMessage } from "./types";
import { supabase } from "../supabase/supabase";

export type MessageWithMetadata = AIMessage & {
  id: string;
  createdAt: string;
};

export type Data = {
  messages: MessageWithMetadata[];
};

// for database insertions
export const addMetadata = (message: AIMessage) => {
  return {
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
};

// so openAI doesn't recieve an object with props it doesn't need
export const removeMetadata = (message: MessageWithMetadata) => {
  const { id, createdAt, ...rest } = message;
  return rest;
};

const defaultData: Data = {
  messages: [],
};

export const getDb = async () => {
  const db = () => {
    // init db connection
  };
  return db;
};

export const storeMessages = async (messages: AIMessage[]) => {
  console.log("messages in storeMessages: ", messages);
  const { data, error } = await supabase.from("messages").insert([...messages]);
  console.log("data in storeMessages: ", data);
  if (error) {
    console.error("Error inserting message:", error);
  } else {
    console.log("Inserted message:", data);
  }
};

export async function getMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    // .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }

  return data;
}
