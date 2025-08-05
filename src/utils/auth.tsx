import { Auth } from 'aws-amplify';

// Simple auth helper functions for AWS Amplify
export const getCurrentUser = async () => {
  try {
    return await Auth.currentAuthenticatedUser();
  } catch (error) {
    return null;
  }
};

export const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export const isAuthenticated = async () => {
  try {
    await Auth.currentAuthenticatedUser();
    return true;
  } catch (error) {
    return false;
  }
};
