import { Text, View } from "react-native";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
// yarn add stream-chat
import { StreamChat } from 'stream-chat'; // if you're using common js      const StreamChat = require('stream-chat').StreamChat;
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";


export default function Index() {
  return(
    App()
  );
  //return (
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <Text>Edit app/index.tsx to edit this screen.</Text>
    // </View>
  //);
}

// instantiate your stream client using the API key and secret
          // the secret is only used server side and gives you full access to the API
          // find your API keys here https://getstream.io/dashboard/
          // you can still use new StreamChat('api_key', 'api_secret');
const apiKey = '92gptpbs9h8m';
const api_secret = '55pa7bbvvrt5m4g45dqeseyy2ht2n86g2penwz4chnw3xa4ah64whvfj3akvs9j3';
const serverClient = StreamChat.getInstance(apiKey, api_secret);

// generate a token for the user with id 'MackGufen'
const userId = 'MackGufen';
const token = serverClient.createToken(userId); //token created via website:const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiTWFja0d1ZmVuIn0.udMBY_ec7dLcpOf2A7SdfrIXKsKEoUJOEgcPEpPBHNY';


const filters = { members: { $in: [userId] }, type: "messaging" };
const options = { presence: true, state: true };
const sort = { last_message_at: -1 };


const App = () => {
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: { id: userId },
  });

  console.log("ATTENTION");
  console.log(serverClient);
  
  if (!client) return <div>Loading...</div>;

  // const channel = client.channel("messaging", {
  //   image: "https://cdn.com/image.png",
  //   name: "Just Chatting",
  //   members: ["name1", "name2"],
  //   // option to add custom fields
  // });

  return (
    <Chat client={client}>
      <ChannelList /*sort={sort}*/ filters={filters} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};
