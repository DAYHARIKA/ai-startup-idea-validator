import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import IdeaCard from '../components/IdeaCard'

const Dashboard = () => {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ideas')
        setIdeas(response.data)
      } catch (err) {
        setError('Failed to load ideas.')
      } finally {
        setLoading(false)
      }
    }
    fetchIdeas()
  }, [])

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Ideas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map(idea => (
          <IdeaCard key={idea._id} idea={idea} />
        ))}
      </div>
      <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit New Idea</Link>
    </div>
  )
}

export default Dashboard