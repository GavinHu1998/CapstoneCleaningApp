import { Chat, OverlayProvider, useCreateChatClient } from 'stream-chat-expo';
import { API_KEY, userId, chatUserName, userToken, getCompanyLoginName } from './chatConfigInfo';
import { SafeAreaView } from 'react-native';
import { Text } from "react-native";
import React, { createContext, PropsWithChildren, useContext } from 'react';
import { StreamChat } from 'stream-chat';

const user = {
      id: userId,
      name: chatUserName,
    };
console.log(getCompanyLoginName());
export const ChatWrapper = ({ children }: PropsWithChildren<{}>) => {

        const chatClient = useCreateChatClient({
            apiKey: API_KEY,
            userData: user,
            tokenOrProvider: userToken,
        });
      
        if (!chatClient) {
           return (
                  <SafeAreaView>
                    <Text>Loading chat ...</Text>
                  </SafeAreaView>
                );
        }
      
        return (
          <ChatClientContext.Provider value={chatClient}>
          <OverlayProvider>
            <Chat client={chatClient}>
              {children}
            </Chat>
          </OverlayProvider>
          </ChatClientContext.Provider>
        );
      };
//export default ChatWrapper

const ChatClientContext = createContext<StreamChat | null>(null);

export const useChatClient = () => {
  const context = useContext(ChatClientContext);
  if (!context) {
    throw new Error();
  }
  return context;
};