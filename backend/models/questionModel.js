const pool = require('../db');

const Question = {
  async create({ questionText, email }) {
    try {
      const [result] = await pool.query(
        'INSERT INTO Question (questionText, email) VALUES (?, ?)',
        [questionText, email]
      );
      return { questionId: result.insertId, questionText, email };
    } catch (error) {
      console.error('Error creating question:', error);
      throw error; 
    }
  },

  async findAllWithAnswers() {
    try {
      const [questions] = await pool.query('SELECT * FROM Question');
      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error; 
    }
  },

  async findByIdWithAnswers(id) {
    try {
      const [questions] = await pool.query('SELECT * FROM Question WHERE questionId = ?', [id]);
      return questions.length > 0 ? questions[0] : null;
    } catch (error) {
      console.error('Error fetching question by ID:', error);
      throw error; 
    }
  },

  async addAnswer(questionId, { answerText }) {
    try {
      const [result] = await pool.query(
        'UPDATE Question SET answerText = ? WHERE questionId = ?',
        [answerText, questionId]
      );
      return result;
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error; 
    }
  },

  async editAnswer(questionId, { answerText }) {
    try {
      const [result] = await pool.query(
        'UPDATE Question SET answerText = ? WHERE questionId = ?',
        [answerText, questionId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error editing answer:', error);
      throw error; 
    }
  },

  async deleteById(id) {
    try {
      const [result] = await pool.query('DELETE FROM Question WHERE questionId = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error; 
    }
  }
};

module.exports = Question;
