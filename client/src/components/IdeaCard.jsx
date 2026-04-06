import { Link } from 'react-router-dom'

const IdeaCard = ({ idea }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-bold">{idea.title}</h3>
      <p className="text-gray-600 mb-2">{idea.description.substring(0, 100)}...</p>
      <Link to={`/idea/${idea._id}`} className="text-blue-600 hover:underline">View Report</Link>
    </div>
  )
}

export default IdeaCard