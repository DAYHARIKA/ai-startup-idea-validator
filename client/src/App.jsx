import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SubmissionPage from './pages/SubmissionPage'
import Dashboard from './pages/Dashboard'
import IdeaDetail from './pages/IdeaDetail'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">AI Startup Idea Validator</h1>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<SubmissionPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/idea/:id" element={<IdeaDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App