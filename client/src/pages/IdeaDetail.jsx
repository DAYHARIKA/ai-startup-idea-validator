import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const IdeaDetail = () => {
  const { id } = useParams()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ideas/${id}`)
        setIdea(response.data)
      } catch (err) {
        setError('Failed to load idea.')
      } finally {
        setLoading(false)
      }
    }
    fetchIdea()
  }, [id])

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>
  if (!idea) return <div className="text-center py-8">Idea not found.</div>

  const { report } = idea

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{idea.title}</h2>
      <p className="mb-4">{idea.description}</p>
      <h3 className="text-xl font-bold mb-2">AI Analysis Report</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-bold">Problem Summary</h4>
          <p>{report.problem}</p>
        </div>
        <div>
          <h4 className="font-bold">Customer Persona</h4>
          <p>{report.customer}</p>
        </div>
        <div>
          <h4 className="font-bold">Market Overview</h4>
          <p>{report.market}</p>
        </div>
        <div>
          <h4 className="font-bold">Competitors</h4>
          <ul className="list-disc list-inside">
            {report.competitor.map((comp, index) => <li key={index}>{comp}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Tech Stack</h4>
          <ul className="list-disc list-inside">
            {report.tech_stack.map((tech, index) => <li key={index}>{tech}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Risk Level</h4>
          <p>{report.risk_level}</p>
        </div>
        <div>
          <h4 className="font-bold">Profitability Score</h4>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-blue-600">{report.profitability_score}/100</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  report.profitability_score >= 70 ? 'bg-green-500' :
                  report.profitability_score >= 50 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${report.profitability_score}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold">Justification</h4>
          <p>{report.justification}</p>
        </div>
      </div>
    </div>
  )
}

export default IdeaDetail