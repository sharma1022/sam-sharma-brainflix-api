const express = require("express");
const router = express.Router();
const fs = require("fs");

function readFile(file, callback) {
    fs.readFile(file, "utf8", callback);
}

router.get("/",
  (req, res) => {
    readFile("./data/video-details.json", (err, data) => {
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

// router.get("/", (req, res) => {
//     res.send("Hello World!!!!");
// })

module.exports = router;
