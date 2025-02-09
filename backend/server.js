// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Set up MongoDB
mongoose.connect('mongodb://localhost/tiktok-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const videoSchema = new mongoose.Schema({
  url: String,
  caption: String,
  username: String,
  userAvatar: String,
  songName: String,
  likes: { type: Number, default: 0 },
  comments: [{ text: String, user: String }],
});

const Video = mongoose.model('Video', videoSchema);

// Multer setup for video file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post('/api/videos', upload.single('video'), async (req, res) => {
  try {
    const newVideo = new Video({
      url: '/uploads/' + req.file.filename,
      caption: req.body.caption,
      username: req.body.username,
      userAvatar: req.body.userAvatar,
      songName: req.body.songName,
    });

    await newVideo.save();
    res.status(200).send('Video uploaded successfully!');
  } catch (err) {
    res.status(500).send('Error uploading video');
  }
});

app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).send('Error fetching videos');
  }
});

// Listen on port 5000
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
