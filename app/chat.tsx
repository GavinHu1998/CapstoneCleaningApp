import React, { createContext, useContext, useEffect, useState } from "react";
import { ChannelSort } from "stream-chat";
import { ChannelList, Channel, useCreateChatClient, MessageList, MessageInput } from "stream-chat-expo";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { WrapInAppContext } from "./ChatStuff/chatContext"
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { API_KEY, userId, chatUserName, userToken } from './ChatStuff/chatConfigInfo';
import { StreamChatGenerics } from '../types';
import { ChatWrapper, useChatClient } from "./ChatStuff/chatWrap";
import { CreateChannel } from "./ChatStuff/CreateChannel";



const Stack = createStackNavigator();

const chatArea = () => {
  const ChannelListScreen = props => {
    
    return (
      <ChannelList
      onSelect={(channel) => {
        const {navigation} = props;
        const channelData = {
          id: channel.id,
          name: channel.data.name,
      };
      navigation.navigate('Chat', { channelData });

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
 

const ChannelScreen = ({ route }) => {
      const { channelData } = route.params;
      const client = useChatClient();
      const channel = client.channel('messaging', channelData.id);
  

  if (!channel) {
    return (
      <SafeAreaView>
        <Text>Loading chat ...</Text>
      </SafeAreaView>
    );
  }
    return (
      <Channel channel = {channel}>
        <MessageList/>
        <MessageInput/>
      </Channel>
    )
  }

 return (
  <SafeAreaProvider>
  <GestureHandlerRootView>
<WrapInAppContext>
      <ChatWrapper>
        
        <SafeAreaView style={{ flex: 1 }}>
          <CreateChannel></CreateChannel>
        <Stack.Navigator>
        
            <Stack.Screen name="Channel List" component={ChannelListScreen}/>
            <Stack.Screen name="Chat" component={ChannelScreen}/>
            
          </Stack.Navigator>
        </SafeAreaView>
        
      </ChatWrapper>
</WrapInAppContext>
  </GestureHandlerRootView>
  </SafeAreaProvider>
  );

};
 
 
export default chatArea;