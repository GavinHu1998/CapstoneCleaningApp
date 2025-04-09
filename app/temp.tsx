import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat, ChannelSort } from "stream-chat";
import { Chat, OverlayProvider, ChannelList, Channel, useCreateChatClient, MessageList, MessageInput } from "stream-chat-expo";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { chatClient, useChatClient } from "./ChatStuff/InitializeChat";
import { WrapInAppContext } from "./ChatStuff/chatContext"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//import { userId } from "./ChatStuff/chatConfigInfo"
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { API_KEY, userId, chatUserName, userToken } from './ChatStuff/chatConfigInfo';
import { StreamChatGenerics } from '../types';
import { ChatWrapper } from "./ChatStuff/chatWrap";



const Stack = createStackNavigator();

const test = () => {


  const ChannelListScreen = props => {
    return (
      <ChannelList
      onSelect={(channel) => {
        const {navigation} = props;
        navigation.navigate('ChannelScreen', { channel })
      }}
      filters={filters}
      sort={sort}
      options={options}
      />
    );
  };
  const filters = {
    members: {
      '$in': [userId]
    },
  };
  const sort: ChannelSort<StreamChatGenerics> = { last_updated: -1 };
  const options = {
    presence: true,
    state: true,
    watch: true,
  };
  const ChannelScreen = props => {
    const { route } = props;
    const { params: { channel } } = route;

    return (
      <Channel channel = {channel}>
        <MessageList/>
        <MessageInput/>
      </Channel>
    )
  }

  const constructChat = () => {
  
      const readyToConstruct = useChatClient();

    if (!readyToConstruct) {
      return (
        <SafeAreaView>
          <Text>Loading chat ...</Text>
        </SafeAreaView>
      );
    }
  
    // const user = {
    //   id: userId,
    //   name: chatUserName,
    // };
    
    //   const chatClient: StreamChat<StreamChatGenerics> = useCreateChatClient({
    //     apiKey: API_KEY,
    //     userData: user,
    //     tokenOrProvider: userToken,
    //   });
    

    return (
    <Chat client={chatClient}>
      <Stack.Navigator>
        <Stack.Screen name="ChannelListScreen" component={ChannelListScreen} />
        <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
      </Stack.Navigator>
    </Chat>      
    );
  };


 return (
  <SafeAreaProvider>
  <GestureHandlerRootView>
    <OverlayProvider>
      <ChatWrapper>
      <WrapInAppContext>
        <SafeAreaView style={{ flex: 1 }}>  
          <Stack.Navigator>
            <Stack.Screen name="channelListScreen" component={ChannelListScreen}/>
            <Stack.Screen name="channelScreen" component={ChannelScreen}/>
          </Stack.Navigator>
        </SafeAreaView>
      </WrapInAppContext>
      </ChatWrapper>
    </OverlayProvider>
  </GestureHandlerRootView>
  </SafeAreaProvider>
  );

};
 
 
export default test;