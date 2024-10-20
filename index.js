const express = require("express");
const app = express();
const cors = require("cors");
const videoRoutes = require("./routes/videos");

// Configuration
require("dotenv").config();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.static("public")); 
app.use(express.json()); 

// Routes
app.use("/videos", videoRoutes);

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});