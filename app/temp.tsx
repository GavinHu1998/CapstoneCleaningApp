import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat, ChannelSort } from "stream-chat";
import { Chat, OverlayProvider, ChannelList, Channel, useCreateChatClient, MessageList, MessageInput } from "stream-chat-expo";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { chatClient, useChatClient } from "./ChatStuff/InitializeChat";
import { useAppContext, WrapInAppContext } from "./ChatStuff/chatContext"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { API_KEY, userId, chatUserName, userToken } from './ChatStuff/chatConfigInfo';
import { StreamChatGenerics } from '../types';
import { ChatWrapper } from "./ChatStuff/chatWrap";



const Stack = createStackNavigator();

const test = () => {


  // const ChannelListScreen = props => {
  //   const { navigation } = props;
  //   const { setChannel } = useAppContext();
  //   return (
  //     <ChannelList
  //       onSelect={(channel) => {
  //         setChannel(channel);
  //         navigation.navigate('ChannelScreen');
  //       }
  //     }
  //     filters={filters}
  //     sort={sort}
  //     options={options}
  //     />
  //   );
  // };
  const ChannelListScreen = props => {
    
    return (
      <ChannelList
      onSelect={(channel) => {
        const {navigation} = props;
        console.log(channel);
        navigation.navigate('channelScreen', { channel });
        //navigation.navigate('channelScreen', { channelId: channel.id });
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
  // const ChannelScreen = (props) => {
  //   const { channel, setChannel } = useAppContext();
  //   console.log(props);
  //   if (!channel) {
  //     return (
  //       <SafeAreaView>
  //         <Text>Loading chat ...</Text>
  //       </SafeAreaView>
  //     );
  //   }
  
  //   return (
  //     <Channel channel={channel}>
  //       <MessageList />
  //       <MessageInput />
  //     </Channel>
  //   );
  // };
  const ChannelScreen = props => {
    const { route } = props;
    const { params: { channel } } = route;
    console.log(channel);

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
        <Stack.Navigator>
            <Stack.Screen name="channelListScreen" component={ChannelListScreen}/>
            <Stack.Screen name="channelScreen" component={ChannelScreen}/>
          </Stack.Navigator>
        </SafeAreaView>
        
      </ChatWrapper>
</WrapInAppContext>
  </GestureHandlerRootView>
  </SafeAreaProvider>
  );

};
 
 
export default test;