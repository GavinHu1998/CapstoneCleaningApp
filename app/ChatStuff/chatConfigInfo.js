import * as SecureStore from 'expo-secure-store';
import { StreamChat } from 'stream-chat';


export const API_KEY = "92gptpbs9h8m";   
export const userId = "MackGufen";
export const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiTWFja0d1ZmVuIn0.udMBY_ec7dLcpOf2A7SdfrIXKsKEoUJOEgcPEpPBHNY"; //mackgufen
export const chatUserName = "John Doe";
// export const userId = "Services-Pro";
// export const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiU2VydmljZXMtUHJvIn0.JJskGR579UWuuyVOXUCVtPm7BFCMPUIQr8B2ziIIWVI"; //services-pro
// export const chatUserName = "tester";



export const getCompanyLoginName = async () => {
    try {
      const companyLoginName = await SecureStore.getItemAsync('company_login_name');
      return companyLoginName || 'MackGufen';
    } catch (error) {
      console.error('Error retrieving company_login_name:', error);
      return 'MackGufen';
    }
  };

  
 //export let userId = getCompanyLoginName(); // Set userId to the company login name

// const serverClient = StreamChat.getInstance(API_KEY);
// export let userToken;
// getCompanyLoginName().then((id) => {
//     userId = id;
//     userToken = serverClient.createToken(userId);
// }).catch((error) => {
//     console.error('Error creating token:', error);
// });