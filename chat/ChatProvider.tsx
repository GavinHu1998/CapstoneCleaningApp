import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useColorScheme } from "react-native";

// Initialize the Stream Chat client
const API_KEY = "92gptpbs9h8m"; // Replace with your actual API key
const chatClient = StreamChat.getInstance(API_KEY);

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const connectUser = async () => {
      try {
        const userId = "MackGufen"; // Replace with actual user ID
        const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiTWFja0d1ZmVuIn0.udMBY_ec7dLcpOf2A7SdfrIXKsKEoUJOEgcPEpPBHNY"; // Replace with token from your backend
        
        await chatClient.connectUser(
          {
            id: userId,
            name: "John Doe", // Replace with actual user data
          },
          userToken
        );

        setClientReady(true);
      } catch (error) {
        console.error("Stream Chat connection error:", error);
      }
    };

    connectUser();

    return () => {
      chatClient.disconnectUser();
    };
  }, []);

  if (!clientReady) return null;

  return (
    <ChatContext.Provider value={{ chatClient }}>
      <OverlayProvider>
        <Chat client={chatClient} theme={colorScheme === "dark" ? "dark" : "light"}>
          {children}
        </Chat>
      </OverlayProvider>
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
