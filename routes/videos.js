const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const randomName = require("random-name");
const multer = require("multer");

const videosFile = path.join(__dirname, "../data/video-details.json");

//multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/");
    },
    filename: (req, file, cb) => {
        cb(null, `${+Date.now()}-${file.originalname}`);
    },
    limits: { fieldSize: 10 * 1024 * 1024 },
});
const upload = multer({ storage });

//get all videos
router
  .route("/")
  .get((req, res) => {
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
  })
  //post video route
  .post(upload.single("file"), (req, res) => {
    if (req.body.title === "" || req.body.description === "") {
      return res.status(400).send("Missing Information.");
    }
    fs.readFile(videosFile, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
      const videoData = JSON.parse(data);

      const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        channel: randomName.first() + " " + randomName.last(),
        image:req.file ? `/images/${req.file.filename}` : req.body.image,
        description: req.body.description,
        views: 0,
        likes: "0",
        duration: "4:01",
        video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
        timestamp: Date.now(),
        comments: [],
      };
      videoData.push(newVideo);

      fs.writeFile(videosFile, JSON.stringify(videoData), (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(201).send(newVideo);
      });
    });
  });

//get selected video
router.get("/:id", (req, res) => {
  fs.readFile(videosFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    const videoId = req.params.id;
    const videoData = JSON.parse(data);
    const selectedVideo = videoData.find((video) => video.id === videoId);

    if (!selectedVideo) {
      return res.status(400).send("Video not found");
    }
    const viewsCount = selectedVideo.views;
    let viewCount = selectedVideo.views;
    if (typeof viewCount === "string") {
      viewCount = parseInt(viewCount.replace(/,/g, ""), 10);
    }
    viewCount++;
    selectedVideo.views = viewsCount.toLocaleString("en-US");

    fs.writeFile(videosFile, JSON.stringify(videoData), (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).json(selectedVideo);
    });
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
      likes: "0",
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

//like comment
router.put("/:videoId/comments/:commentId/likes", (req, res) => {
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
    const selectedComment = selectedVideo.comments.find(
      (comment) => comment.id === commentId
    );
    let likeCount = selectedComment.likes;
    if (typeof likeCount === "string") {
      likeCount = parseInt(likeCount.replace(/,/g, ""), 10);
    }
    likeCount++;
    selectedComment.likes = likeCount.toLocaleString("en-US");

    fs.writeFile(videosFile, JSON.stringify(videoData), (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send("Comment Liked");
    });
  });
});

//like video
router.put("/:videoId/likes", (req, res) => {
  fs.readFile(videosFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    const videoData = JSON.parse(data);
    const videoId = req.params.videoId;
    const selectedVideo = videoData.find((video) => video.id === videoId);
    if (!selectedVideo) {
      return req.status(404).send("Video not found.");
    }
    let likeCount = selectedVideo.likes;
    if (typeof likeCount === "string") {
      likeCount = parseInt(likeCount.replace(/,/g, ""), 10);
    }
    likeCount++;
    selectedVideo.likes = likeCount.toLocaleString("en-US");

    fs.writeFile(videosFile, JSON.stringify(videoData), (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send("Video Liked");
    });
  });
});

module.exports = router;
