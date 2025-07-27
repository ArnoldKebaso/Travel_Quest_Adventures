import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          TravelQuest Adventures
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Tailwind CSS</CardTitle>
              <CardDescription>
                Utility-first CSS framework with Autoprefixer support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                ✅ Tailwind CSS v4 configured<br/>
                ✅ Autoprefixer enabled<br/>
                ✅ PostCSS setup complete
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>shadcn/ui Components</CardTitle>
              <CardDescription>
                Beautiful, reusable components built with Radix UI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                ✅ shadcn/ui CLI installed<br/>
                ✅ Components configured<br/>
                ✅ Button & Card components added
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Interactive Counter</CardTitle>
            <CardDescription>
              Test the setup with this interactive component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button 
                onClick={() => setCount((count) => count + 1)}
                className="w-full"
              >
                Count is {count}
              </Button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Edit <code className="bg-gray-100 px-1 rounded">src/App.tsx</code> and save to test HMR
            </p>
          </CardContent>
        </Card>
        
        <p className="text-center mt-8 text-gray-500">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
