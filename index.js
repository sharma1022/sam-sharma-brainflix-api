const express = require("express");
const app = express();
const cors = require("cors");

const videoRoutes = require("./routes/videos");

require("dotenv").config();
const PORT = process.env.PORT || 8080;
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' https://vercel.live; connect-src 'self' https://vercel.live; img-src 'self'; style-src 'self';"
    );
    next();
});

app.use(cors({ origin :"https://brainflix-chi.vercel.app" }));

app.use(express.json());

app.use(express.static("public"));

app.use("/videos", videoRoutes);
app.get("/",(req,res)=> {
    res.send("Welcome to Brainflix API");
})

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
})