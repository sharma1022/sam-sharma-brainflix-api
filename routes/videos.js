const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const randomName = require("random-name");

const videosFile = path.join(__dirname, "../data/video-details.json");

//get all videos
router.get("/", (req, res) => {
  fs.readFile(videosFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(
      JSON.parse(data).map((video) => ({
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image,
      }))
    );
  });
});

//get selected video
router.get("/:id", (req, res) => {
  fs.readFile(videosFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    const videoId = req.params.id;

    if (JSON.parse(data).find((video) => video.id === videoId) === undefined) {
      return res.status(400).send("Video not found");
    }
    res
      .status(200)
      .json(JSON.parse(data).find((video) => video.id === videoId));
  });
});

//post comment
router.post("/:id/comments", (req, res) => {
  if (req.body.comment === "") {
    return res.status(400).send("No comment body.");
  }
  fs.readFile(videosFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    const videoId = req.params.id;
    const videoData = JSON.parse(data);
    const selectedVideo = videoData.find((video) => video.id === videoId);

    const newComment = {
      id: uuidv4(),
      name: randomName.first() + " " + randomName.last(), //generating a random placeholder name
      comment: req.body.comment,
      likes: 0,
      timestamp: Date.now(),
    };
    selectedVideo.comments.push(newComment);

    fs.writeFile(videosFile, JSON.stringify(videoData), (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).send(newComment);
    });
  });
});

//delete comment
router.delete("/:videoId/comments/:commentId", (req, res) => {
  fs.readFile(videosFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    const videoData = JSON.parse(data);
    const { videoId, commentId } = req.params;
    const selectedVideo = videoData.find((video) => video.id === videoId);
    if (!selectedVideo) {
      return req.status(404).send("Video not found.");
    }
    const commentIndex = selectedVideo.comments.findIndex(
      (comment) => comment.id === commentId
    );

    selectedVideo.comments.splice(commentIndex, 1);

    fs.writeFile(videosFile, JSON.stringify(videoData), (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send("Comment Deleted");
    });
  });
});

module.exports = router;
