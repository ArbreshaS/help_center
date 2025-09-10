const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const usersRouter = require('./routes/users');
const articleRoutes = require('./routes/article');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const questionRoutes = require('./routes/questionRoutes');

dotenv.config();
const app = express();


app.use(cors({
  origin: true,
  credentials: true,
}));



app.use(bodyParser.json({ limit: '10mb' }));


app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/user', usersRouter);
app.use('/article', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/videos', videoRoutes);
app.use('/questions', questionRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


app.use((req, res, next) => {
  res.status(404).send('Route not found');
});


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
