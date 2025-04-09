import { useEffect } from "react";
import { StreamChat } from 'stream-chat';
import { API_KEY, userId, userName, userToken } from './chatConfigInfo';
//import { useCreateChatClient } from 'stream-chat-react-native';

const user = {
    id: userId,
    name: userName,
  };
  export const chatClient = StreamChat.getInstance(API_KEY);
  // const chatClient = useCreateChatClient({
  //       apiKey: chatApiKey,
  //       userData: user,
  //       tokenOrProvider: userToken,
  //     });

//Attempt to connect user to Stream, returns boolean based on results
export const useChatClient = () => {
    const [clientIsReady, setClientIsReady] = useState(false);

    useEffect(() => {
    const connectUser = async () => {
      try {
        await chatClient.connectUser(user, userToken);
        setClientIsReady(true);
      } 
      catch (error) {
        console.error("Stream Chat connection error:", error);
      }};
    }, 
    []);

    return {
        clientIsReady
    }
}
