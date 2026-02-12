import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import StoryBookPage from './pages/StoryBook'
import SignupPage from "./pages/SignupPage";
import PublicLayout from "./layouts/public";
import PrivateLayout from "./layouts/private";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/storybook" element={<StoryBookPage />} />
      </Route>
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  )
}

export default App
