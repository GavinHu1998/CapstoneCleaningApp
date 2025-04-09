import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { useChatClient, chatClient } from "./ChatStuff/useChat";
import { WrapInAppContext } from "./ChatStuff/chatContext"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const test = () => {

  const HomeScreen = () => <Text>chatting</Text>;

  const constructChat = () => {
  
      const readyToConstruct = useChatClient();
  
    if (!readyToConstruct) {
      return (
        <SafeAreaView>
          <Text>Loading chat ...</Text>
        </SafeAreaView>
      );
    }
  

    return (
      <OverlayProvider>
        <Chat client={chatClient}>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </Chat>
      </OverlayProvider>
    );
  };

 return (
  <WrapInAppContext>
    <SafeAreaView style={{ flex: 1 }}>  
      constructChat()
    </SafeAreaView>
  </WrapInAppContext>
  );

};
 
 
export default test;