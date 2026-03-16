import { Account, Client, Databases, ID, Storage } from 'react-native-appwrite';
import 'react-native-url-polyfill/auto';

export const APPWRITE_CONFIG = {
  endpoint:           'https://fra.cloud.appwrite.io/v1',  
  projectId:          "69b72128001df636906b",
  databaseId:         '69b733970013070d57e0'
};
const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const account   = new Account(client);
export const databases = new Databases(client);
export const storage   = new Storage(client);
export { ID };

