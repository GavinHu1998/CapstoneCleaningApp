import React, { useState } from "react";
import { Button, TextInput, View, Text } from "react-native";
import { useChatClient } from "./chatWrap";

export const CreateChannel = () => {
  const chatClient = useChatClient();
  const [channelName, setChannelName] = useState("");
  const [members, setMembers] = useState("");
  const [status, setStatus] = useState("");


  const handleCreateChannel = async () => {
    try {
      const memberList = members.split(",").map((member) => member.trim());
      console.log(channelName, memberList);
      const channel = chatClient.channel("messaging", channelName, {
        name: channelName,
        members: memberList,
        created_by_id: chatClient.userID,
      });
      await channel.create();
      setStatus("Channel created");
    } catch (error) {
      console.error("Error creating channel:", error);
      setStatus("Failed to create channel.");
    }
  };


  return (
    <View style={{ padding: 10 }}>
    <TextInput
      placeholder="Channel Name"
      value={channelName}
      onChangeText={setChannelName}
      placeholderTextColor={ "#888" }
      style={{ borderWidth: 1, height: 30 }}
    />
    <TextInput
      placeholder="Members (comma-separated)"
      value={members}
      onChangeText={setMembers}
      placeholderTextColor={ "#888" }
      style={{ borderWidth: 1, height: 30 }}
    />
    <Button title="Create Channel" onPress={handleCreateChannel} />
    {status ? <Text>{status}</Text> : null}

  </View>
  );
};