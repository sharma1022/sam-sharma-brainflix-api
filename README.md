# Backend API for Brainflix project - Brainstation

## Technologies Used

- NodeJS
- Express.js
- Multer library.
- REST API.
- Postman

## Endpoints

`GET /videos` - Retrieves a list of all videos.

`GET /videos/:id` - Retrieves details of a single video by ID.

`POST /videos` - Adds a new video to the list (requires a JSON body with video details).

`POST /videos/:videoId/comments` - Adds a new comment to a video.

`DELETE /videos/:videoId/comments/:commentId` - Deletes a comment from a video.

`PUT /videos/:videoId/likes` - Increments the like count for a video.

`PUT /videos/:videoId/comments/:commentId/likes` - Increments the like count for a comment.

## Installation

In the project directory,

Install dependencies with npm.

```bash
npm install
```

Install nodemon

```bash
npm install --save-dev nodemon
```

Start the server

```bash
npm dev
```

or

```bash
nodemon server.js
```

- Link to [Frontend](https://github.com/sharma1022/sam-sharma-brainflix.git)
