import { getCurrentUser as amplifyGetCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';

// Simple auth helper functions for AWS Amplify v6
export const getCurrentUser = async () => {
  try {
    return await amplifyGetCurrentUser();
  } catch {
    return null;
  }
};

export const signOut = async () => {
  try {
    await amplifySignOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export const isAuthenticated = async () => {
  try {
    await amplifyGetCurrentUser();
    return true;
  } catch {
    return false;
  }
};
