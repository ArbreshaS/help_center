const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false); 
  }
};

const upload = multer({
  storage: storage, 
  fileFilter: fileFilter, 
  limits: { 
    fileSize: 1024 * 1024 * 10, 
    files: 300, 
    fieldNameSize: 255,
    fieldSize: 1024 * 1024 * 10 
  }
});


router.post('/add', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`; 

  try {
    const newArticle = await Article.create({ title, content, imageUrl });
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const articles = await Article.getAll();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:articleId', async (req, res) => {
  const { articleId } = req.params;
  try {
    const article = await Article.getById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:articleId', upload.single('image'), async (req, res) => {
  const { articleId } = req.params;
  const { title, content } = req.body;
  let imageUrl = req.body.imageUrl; 

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`; 
  }

  try {
    const updated = await Article.update(articleId, { title, content, imageUrl });
    if (!updated) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:articleId', async (req, res) => {
  const { articleId } = req.params;
  try {
    const deleted = await Article.deleteById(articleId);
    if (!deleted) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
