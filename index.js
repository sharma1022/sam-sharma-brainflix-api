const express = require("express");
const app = express();
const cors = require("cors");
const videoRoutes = require("./routes/videos");

require("dotenv").config();

const PORT = process.env.PORT || 8080;

app.use(cors());

app.use("/videos", videoRoutes);

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
})