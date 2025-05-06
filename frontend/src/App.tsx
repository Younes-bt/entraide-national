import { Button } from "@/components/ui/button"


function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 gap-1.5">
      <h1 className="text-2xl font-bold text-white">Hello, World!</h1>
      <Button className="bg-amber-400 mt-8 font-bold">hi</Button>
      <p className="mt-4 text-gray-400">This is a simple React application.</p>
      <p className="mt-2 text-gray-500">Enjoy exploring!</p>
    </div>
  )
}

export default App
