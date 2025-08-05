import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// AWS Amplify Configuration
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure({ 
  ...awsExports, 
  API: { 
    endpoints: [
      { 
        name: 'TravelQuestAPI', 
        endpoint: import.meta.env.VITE_API_URL || 'https://api.placeholder.com'
      }
    ]
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  </StrictMode>,
)
