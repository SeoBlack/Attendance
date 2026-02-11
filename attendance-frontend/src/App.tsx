import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import StoryBookPage from './pages/StoryBook'
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/storybook" element={<StoryBookPage />} />
    </Routes>
  )
}

export default App
