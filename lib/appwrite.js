import { Account, Client, Databases, ID, Storage } from 'react-native-appwrite';
import 'react-native-url-polyfill/auto';

export const APPWRITE_CONFIG = {
  endpoint:           'YOUR_KEY',  
  projectId:          "YOUR_KEY",
  databaseId:         'YOUR_KEY'
};
const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const account   = new Account(client);
export const databases = new Databases(client);
export const storage   = new Storage(client);
export { ID };

