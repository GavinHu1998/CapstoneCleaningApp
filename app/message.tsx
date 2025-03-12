import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { Channel, ChannelList, ChannelPreviewMessenger } from "stream-chat-expo";
import { useChat } from "../chat/ChatProvider";

const Message = () => {
  const { chatClient } = useChat();
  const [selectedChannel, setSelectedChannel] = useState(null);

  if (!chatClient) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D62A1E" />
      </View>
    );
  }

  if (selectedChannel) {
    return <Channel channel={selectedChannel} />;
  }

  return (
    <ChannelList
      client={chatClient}
      Preview={ChannelPreviewMessenger}
      onSelect={setSelectedChannel}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Message;
