const Idea = require('../models/Idea')
const { OpenAI } = require('openai')

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Anthropic API (optional)
let anthropic = null
if (process.env.ANTHROPIC_API_KEY) {
  try {
    const AnthropicSDK = require('@anthropic-ai/sdk')
    anthropic = new AnthropicSDK({ apiKey: process.env.ANTHROPIC_API_KEY })
  } catch (err) {
    console.log('Anthropic SDK not installed, skipping')
  }
}

// Enhanced mock function that generates unique reports based on input
const generateMockReport = (title, description) => {
  const keywords = `${title} ${description}`.toLowerCase()
  
  // Determine risk level based on keywords
  let riskLevel = "Medium"
  let riskKeywords = { low: 0, medium: 0, high: 0 }
  
  if (keywords.includes('ai') || keywords.includes('ml') || keywords.includes('blockchain') || keywords.includes('vr')) {
    riskKeywords.high += 2
  }
  if (keywords.includes('b2b') || keywords.includes('saas') || keywords.includes('platform')) {
    riskKeywords.medium += 2
  }
  if (keywords.includes('mobile') || keywords.includes('app') || keywords.includes('service')) {
    riskKeywords.low += 1
  }
  if (riskKeywords.high > riskKeywords.low) riskLevel = "High"
  if (riskKeywords.low > riskKeywords.high && riskKeywords.low > riskKeywords.medium) riskLevel = "Low"
  
  // Generate profitability score based on keywords (0-100)
  let profitabilityScore = 60
  if (keywords.includes('enterprise') || keywords.includes('b2b')) profitabilityScore = 80
  if (keywords.includes('subscription') || keywords.includes('saas')) profitabilityScore = 85
  if (keywords.includes('marketplace')) profitabilityScore = 75
  if (keywords.includes('educational') || keywords.includes('nonprofit')) profitabilityScore = 40
  if (keywords.includes('gaming')) profitabilityScore = 70
  if (keywords.includes('social')) profitabilityScore = 55
  if (keywords.includes('e-commerce')) profitabilityScore = 72
  if (keywords.includes('healthcare')) profitabilityScore = 68
  profitabilityScore = Math.min(100, Math.max(20, profitabilityScore + Math.floor(Math.random() * 16) - 8))
  
  // Generate relevant competitors
  const competitorMap = {
    'ai': ['OpenAI', 'Google Bard', 'Anthropic Claude'],
    'marketplace': ['eBay', 'Shopify', 'Etsy'],
    'saas': ['Salesforce', 'HubSpot', 'Notion'],
    'social': ['Meta', 'TikTok', 'Discord'],
    'education': ['Coursera', 'Udemy', 'Skillshare'],
    'health': ['Teladoc', 'Ro', 'Hims'],
    'fintech': ['Stripe', 'Square', 'Wise'],
    'gaming': ['Roblox', 'Fortnite', 'Minecraft'],
  }
  
  let competitors = ['Established Player A', 'Emerging Competitor B', 'Direct Competitor C']
  for (const [key, value] of Object.entries(competitorMap)) {
    if (keywords.includes(key)) {
      competitors = value
      break
    }
  }
  
  // Generate relevant tech stack
  const techStackMap = {
    'mobile': ['React Native', 'Flutter', 'Swift'],
    'web': ['React', 'Vue.js', 'Angular'],
    'ai': ['Python', 'TensorFlow', 'PyTorch'],
    'blockchain': ['Solidity', 'Web3.js', 'Ethereum'],
    'backend': ['Node.js', 'Python', 'Go'],
    'database': ['PostgreSQL', 'MongoDB', 'Redis'],
    'cloud': ['AWS', 'Google Cloud', 'Azure'],
  }
  
  let techStack = ['Node.js', 'React', 'MongoDB']
  const foundTechs = new Set()
  
  for (const [key, value] of Object.entries(techStackMap)) {
    if (keywords.includes(key)) {
      value.forEach(tech => {
        if (foundTechs.size < 3) {
          foundTechs.add(tech)
        }
      })
    }
  }
  
  if (foundTechs.size > 0) {
    techStack = Array.from(foundTechs)
  }
  
  const titleWords = title.split(' ')
  const mainWord = titleWords[0]
  
  return {
    problem: `${title} addresses a critical gap in the market. ${description.substring(0, 120)}... This solution targets inefficiencies in the current market approach and provides a more streamlined alternative.`,
    customer: `Early adopters and tech-forward professionals seeking innovative solutions. Primary demographic: entrepreneurs and business professionals aged 22-55 looking to ${mainWord.toLowerCase()} their operations efficiently.`,
    market: `Market potential estimated at $1-8B annually depending on adoption rate. Growing market with ${riskKeywords.high > 0 ? '25-35%' : '10-20%'} YoY growth. Underserved segments present significant opportunities.`,
    competitor: competitors,
    tech_stack: techStack,
    risk_level: riskLevel,
    profitability_score: profitabilityScore,
    justification: `${riskLevel === 'Low' ? 'Low-risk opportunity' : riskLevel === 'High' ? 'High-risk but potentially high-reward opportunity' : 'Balanced risk-reward profile'} with profitability score of ${profitabilityScore}/100. ${profitabilityScore >= 70 ? 'Strong market demand signals and good revenue potential.' : 'Requires careful execution to achieve profitability.'} Recommended actions: validate market demand, analyze competitor positioning, and develop go-to-market strategy.`
  }
}

// AI Provider: OpenAI
const generateReportWithOpenAI = async (title, description) => {
  const prompt = `You are an expert startup analyst. Analyze this startup idea and return ONLY a valid JSON object (no markdown, no extra text):

{
  "problem": "Clear problem statement (1-2 sentences)",
  "customer": "Target customer persona (1-2 sentences)",
  "market": "Market overview with size and growth (1-2 sentences)",
  "competitor": ["Competitor 1", "Competitor 2", "Competitor 3"],
  "tech_stack": ["Technology 1", "Technology 2", "Technology 3"],
  "risk_level": "Low|Medium|High",
  "profitability_score": 75,
  "justification": "Why this score? Market fit, revenue potential, competitive advantage (2-3 sentences)"
}

Title: ${title}
Description: ${description}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    })
    
    const responseText = completion.choices[0].message.content.trim()
    console.log('OpenAI response:', responseText)
    
    const report = JSON.parse(responseText)
    
    // Validate and normalize response
    return {
      problem: report.problem || '',
      customer: report.customer || '',
      market: report.market || '',
      competitor: Array.isArray(report.competitor) ? report.competitor : [],
      tech_stack: Array.isArray(report.tech_stack) ? report.tech_stack : [],
      risk_level: ['Low', 'Medium', 'High'].includes(report.risk_level) ? report.risk_level : 'Medium',
      profitability_score: Math.min(100, Math.max(0, parseInt(report.profitability_score) || 60)),
      justification: report.justification || ''
    }
  } catch (err) {
    console.error('OpenAI error:', err.message)
    throw err
  }
}

// AI Provider: Anthropic
const generateReportWithAnthropic = async (title, description) => {
  if (!anthropic) throw new Error('Anthropic not configured')
  
  const prompt = `You are an expert startup analyst. Analyze this startup idea and return ONLY a valid JSON object (no markdown, no extra text):

{
  "problem": "Clear problem statement (1-2 sentences)",
  "customer": "Target customer persona (1-2 sentences)",
  "market": "Market overview with size and growth (1-2 sentences)",
  "competitor": ["Competitor 1", "Competitor 2", "Competitor 3"],
  "tech_stack": ["Technology 1", "Technology 2", "Technology 3"],
  "risk_level": "Low|Medium|High",
  "profitability_score": 75,
  "justification": "Why this score? Market fit, revenue potential, competitive advantage (2-3 sentences)"
}

Title: ${title}
Description: ${description}`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ],
    })
    
    const responseText = message.content[0].text
    console.log('Anthropic response:', responseText)
    
    const report = JSON.parse(responseText)
    
    return {
      problem: report.problem || '',
      customer: report.customer || '',
      market: report.market || '',
      competitor: Array.isArray(report.competitor) ? report.competitor : [],
      tech_stack: Array.isArray(report.tech_stack) ? report.tech_stack : [],
      risk_level: ['Low', 'Medium', 'High'].includes(report.risk_level) ? report.risk_level : 'Medium',
      profitability_score: Math.min(100, Math.max(0, parseInt(report.profitability_score) || 60)),
      justification: report.justification || ''
    }
  } catch (err) {
    console.error('Anthropic error:', err.message)
    throw err
  }
}

// HuggingFace (via Inference API)
const generateReportWithHuggingFace = async (title, description) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY
  if (!apiKey) throw new Error('HuggingFace API key not configured')
  
  const prompt = `You are an expert startup analyst. Analyze this startup idea and return ONLY a valid JSON object:

{
  "problem": "Problem statement",
  "customer": "Customer persona",
  "market": "Market overview",
  "competitor": ["Competitor 1", "Competitor 2", "Competitor 3"],
  "tech_stack": ["Tech 1", "Tech 2", "Tech 3"],
  "risk_level": "Low|Medium|High",
  "profitability_score": 75,
  "justification": "Why this score"
}

Title: ${title}
Description: ${description}`

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', {
      headers: { Authorization: `Bearer ${apiKey}` },
      method: 'POST',
      body: JSON.stringify({ inputs: prompt }),
    })
    
    const result = await response.json()
    const responseText = result[0]?.generated_text || ''
    console.log('HuggingFace response:', responseText)
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')
    
    const report = JSON.parse(jsonMatch[0])
    
    return {
      problem: report.problem || '',
      customer: report.customer || '',
      market: report.market || '',
      competitor: Array.isArray(report.competitor) ? report.competitor : [],
      tech_stack: Array.isArray(report.tech_stack) ? report.tech_stack : [],
      risk_level: ['Low', 'Medium', 'High'].includes(report.risk_level) ? report.risk_level : 'Medium',
      profitability_score: Math.min(100, Math.max(0, parseInt(report.profitability_score) || 60)),
      justification: report.justification || ''
    }
  } catch (err) {
    console.error('HuggingFace error:', err.message)
    throw err
  }
}

const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find()
    res.json(ideas)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
    if (!idea) return res.status(404).json({ message: 'Idea not found' })
    res.json(idea)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createIdea = async (req, res) => {
  const { title, description } = req.body
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' })
  }

  try {
    console.log('Creating idea:', { title, description })
    
    let report
    let aiProvider = 'none'
    
    // Try OpenAI first
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('Attempting to generate report with OpenAI...')
        report = await generateReportWithOpenAI(title, description)
        aiProvider = 'OpenAI'
        console.log('Successfully generated report with OpenAI')
      } catch (openaiErr) {
        console.error('OpenAI failed:', openaiErr.message)
        report = null
      }
    }
    
    // Try Anthropic if OpenAI failed
    if (!report && anthropic) {
      try {
        console.log('Attempting to generate report with Anthropic...')
        report = await generateReportWithAnthropic(title, description)
        aiProvider = 'Anthropic'
        console.log('Successfully generated report with Anthropic')
      } catch (anthropicErr) {
        console.error('Anthropic failed:', anthropicErr.message)
        report = null
      }
    }
    
    // Try HuggingFace if both failed
    if (!report && process.env.HUGGINGFACE_API_KEY) {
      try {
        console.log('Attempting to generate report with HuggingFace...')
        report = await generateReportWithHuggingFace(title, description)
        aiProvider = 'HuggingFace'
        console.log('Successfully generated report with HuggingFace')
      } catch (hfErr) {
        console.error('HuggingFace failed:', hfErr.message)
        report = null
      }
    }
    
    // Fall back to mock report if all AI providers failed
    if (!report) {
      console.log('All AI providers failed, using mock report')
      report = generateMockReport(title, description)
      aiProvider = 'mock'
    }
    
    // Save idea with AI provider info
    const idea = new Idea({ 
      title, 
      description, 
      report,
      aiProvider 
    })
    const savedIdea = await idea.save()
    console.log(`Idea saved with ${aiProvider} provider:`, savedIdea._id)
    res.status(201).json(savedIdea)
  } catch (err) {
    console.error('Create idea error:', err)
    res.status(500).json({ message: err.message || 'Failed to create idea' })
  }
}

const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id)
    if (!idea) return res.status(404).json({ message: 'Idea not found' })
    res.json({ message: 'Idea deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getIdeas, getIdea, createIdea, deleteIdea }