
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider?: 'local' | 'google' | 'facebook';
  createdAt: string;  
  updatedAt: string;  
  __v?: number;       
}