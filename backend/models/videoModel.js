const pool = require('../db'); 

const Video = {
  async create({ title, url, description, thumbnail }) {
    const [result] = await pool.query(
      'INSERT INTO Video (title, url, description, thumbnail) VALUES (?, ?, ?, ?)',
      [title, url, description, thumbnail]
    );
    return { videoId: result.insertId, title, url, description, thumbnail };
  },

  async findAll() {
    const [videos] = await pool.query('SELECT * FROM Video');
    return videos;
  },

  async findById(id) {
    const [videos] = await pool.query('SELECT * FROM Video WHERE videoId = ?', [id]);
    return videos.length > 0 ? videos[0] : null;
  },

  async deleteById(id) {
    const [result] = await pool.query('DELETE FROM Video WHERE videoId = ?', [id]);
    return result.affectedRows > 0;
  },

  async updateById(id, { title, url, description, thumbnail }) {
    const [result] = await pool.query(
      'UPDATE Video SET title = ?, url = ?, description = ?, thumbnail = ? WHERE videoId = ?',
      [title, url, description, thumbnail, id]
    );
    if (result.affectedRows > 0) {
      return { videoId: id, title, url, description, thumbnail };
    }
    return null; 
  }
};

module.exports = Video;
