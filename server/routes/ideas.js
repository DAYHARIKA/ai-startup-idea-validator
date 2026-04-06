const express = require('express')
const router = express.Router()
const { getIdeas, getIdea, createIdea, deleteIdea } = require('../controllers/ideasController')

router.get('/', getIdeas)
router.get('/:id', getIdea)
router.post('/', createIdea)
router.delete('/:id', deleteIdea)

module.exports = router