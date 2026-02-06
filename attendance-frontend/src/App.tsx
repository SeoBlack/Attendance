import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import StoryBookPage from './pages/StoryBook'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/storybook" element={<StoryBookPage />} />
    </Routes>
  )
}

export default App
