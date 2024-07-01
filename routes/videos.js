const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const videosFile = path.join(__dirname, "../data/video-details.json");

const readFile = (file, callback) => {
  fs.readFile(file, "utf8", callback);
}

//get all videos
router.get("/", (req, res) => {
  readFile(videosFile, (err, data) => {
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
router.get("/:id", (req,res) => {
    readFile(videosFile, (err, data) => {
        if(err){
            return res.status(500).send(err);
        }
        const videoId = req.params.id;

        if (JSON.parse(data).find((video) => video.id === videoId) === undefined){
            return res.status(400).send("Video not found");
        }
        res.status(200).json(JSON.parse(data).find((video) => video.id === videoId));
    })
})

module.exports = router;
