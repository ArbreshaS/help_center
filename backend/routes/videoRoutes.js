const express = require('express');
const router = express.Router();
const Video = require('../models/videoModel');

router.use(express.json());


function extractVideoId(url) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\n\s]{11})/);
  return match ? match[1] : null;
}


router.post('/add', async (req, res) => {
  const { title, url, description } = req.body;

  if (!title || !url || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    
    const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

    const video = await Video.create({ title, url, description, thumbnail });
    res.status(201).json(video);
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (!video) {
      res.status(404).json({ error: 'Video not found' });
    } else {
      res.status(200).json(video);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const success = await Video.deleteById(id);
    if (!success) {
      res.status(404).json({ error: 'Video not found' });
    } else {
      res.status(200).json({ message: 'Video deleted' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, url, description } = req.body;

  if (!title || !url || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    
    const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

    const updatedVideo = await Video.updateById(id, { title, url, description, thumbnail });
    if (!updatedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
