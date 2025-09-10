const pool = require('../db');

const Article = {
  async create({ title, content, imageUrl }) {
    try {
      const [result] = await pool.query(
        'INSERT INTO Article (title, content, imageUrl) VALUES (?, ?, ?)',
        [title, content, imageUrl]
      );
      return { articleId: result.insertId, title, content, imageUrl };
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      const [articles] = await pool.query('SELECT * FROM Article');
      return articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  async getById(articleId) {
    try {
      const [articles] = await pool.query('SELECT * FROM Article WHERE articleId = ?', [articleId]);
      return articles.length > 0 ? articles[0] : null;
    } catch (error) {
      console.error('Error fetching article by ID:', error);
      throw error;
    }
  },
   async update(articleId, { title, content, imageUrl }) {
    try {
      const [result] = await pool.query(
        'UPDATE Article SET title = ?, content = ?, imageUrl = ? WHERE articleId = ?',
        [title, content, imageUrl, articleId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  async deleteById(articleId) {
    try {
      const [result] = await pool.query('DELETE FROM Article WHERE articleId = ?', [articleId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  },
};

module.exports = Article;
