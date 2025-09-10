const express = require('express');
const router = express.Router();
const Question = require('../models/questionModel');

router.use(express.json());


router.post('/add', async (req, res) => {
  const { questionText, email } = req.body;

  if (!questionText || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const question = await Question.create({ questionText, email });
    res.status(201).json(question);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const questions = await Question.findAllWithAnswers();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByIdWithAnswers(id);
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
    } else {
      res.status(200).json(question);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/:questionId/answers', async (req, res) => {
  const { questionId } = req.params;
  const { answerText } = req.body;

  if (!answerText ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const question = await Question.findByIdWithAnswers(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    await Question.addAnswer(questionId, { answerText });

    const updatedQuestion = await Question.findByIdWithAnswers(questionId);
    res.status(201).json(updatedQuestion);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:questionId/answers', async (req, res) => {
  const { questionId } = req.params;
  const { answerText } = req.body;

  if (!answerText) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const question = await Question.findByIdWithAnswers(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const success = await Question.editAnswer(questionId, { answerText });
    if (!success) {
      return res.status(500).json({ error: 'Error editing answer' });
    }

    const updatedQuestion = await Question.findByIdWithAnswers(questionId);
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error('Error editing answer:', error);
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const success = await Question.deleteById(id);
    if (!success) {
      res.status(404).json({ error: 'Question not found' });
    } else {
      res.status(200).json({ message: 'Question deleted' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
