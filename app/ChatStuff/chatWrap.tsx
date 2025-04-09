import { Chat, OverlayProvider, useCreateChatClient } from 'stream-chat-expo';
import { API_KEY, userId, chatUserName, userToken } from './chatConfigInfo';
import { SafeAreaView } from 'react-native';
import { Text } from "react-native";
import React, { PropsWithChildren } from 'react';

const user = {
      id: userId,
      name: chatUserName,
    };

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
          <OverlayProvider>
            <Chat client={chatClient}>
              {children}
            </Chat>
          </OverlayProvider>
        );
      };