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

// The `addMetadata` function enriches a message with a unique ID and timestamp.
// This is crucial for maintaining message order and for database indexing.
export const addMetadata = (message: AIMessage) => {
  return {
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
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

// The `storeMessages` function now accepts a `conversationId` and uses the `addMetadata`
// function to ensure all messages are stored with the necessary metadata.
export const storeMessages = async (
  messages: AIMessage[],
  conversationId: string
) => {
  const messagesWithMetadata = messages.map((message) =>
    addMetadata({ ...message, conversation_id: conversationId })
  );

  console.log("messages in storeMessages: ", messagesWithMetadata);
  const { data, error } = await supabase
    .from("messages")
    .insert(messagesWithMetadata);
  console.log("data in storeMessages: ", data);
  if (error) {
    console.error("Error inserting message:", error);
  } else {
    console.log("Inserted message:", data);
  }
};

// The `getMessages` function now fetches messages for a specific `conversationId`,
// ensuring that only relevant messages are returned.
export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }

  return data;
}
