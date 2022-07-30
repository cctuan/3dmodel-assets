import { useState } from 'react'
import reactLogo from './assets/react.svg'
import BabylonComponent from './components/BabylonComponent'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <BabylonComponent/>
    </div>
  )
}

export default App
