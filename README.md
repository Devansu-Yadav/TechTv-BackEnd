# TechTv-BackEnd
Do you love Science & Technology?😍💙 Well, then you are exactly at the best place where you could learn and build your passion & curiosity for Technology with Tech Tv! A Video Library which helps you learn technologies & use them to build cool projects! 👨‍💻

This repository contains the Back-End code for TechTv.

## Tech Stack

- Express.js
- Node.js
- MongoDB
- Mongoose

## Features

- API routes implemented:
    - [Auth](https://github.com/Devansu-Yadav/TechTv-BackEnd/blob/development/routes/auth.route.js):
        - Login: `[POST] - /api/auth/login`
        - Signup: `[POST] - /api/auth/signup`
        - Password reset: `[POST] - /api/auth/passwordReset`
    - [Categories](https://github.com/Devansu-Yadav/TechTv-BackEnd/blob/development/routes/categories.route.js):
        - `[GET] - /api/categories`
        - `[GET] - /api/categories/:categoryId`
    - [Videos](https://github.com/Devansu-Yadav/TechTv-BackEnd/blob/development/routes/videos.route.js):
        - `[GET] - /api/videos`
        - `[GET] - /api/videos/:videoId`
    - [Users](https://github.com/Devansu-Yadav/TechTv-BackEnd/blob/development/routes/user.route.js):
        - Like videos:
            - `[GET, POST] - /api/user/likes`
            - `[DELETE] - /api/user/likes/:videoId`
        - Watch later:
            - `[GET, POST] - /api/user/watchlater`
            - `[DELETE] - /api/user/watchlater/:videoId`
        - Watch history:
            - `[GET, POST, DELETE] - /api/user/history`
            - `[DELETE] - /api/user/history/:videoId`
        - Playlists:
            - `[GET, POST] - /api/user/playlists`
            - `[GET, POST, DELETE] - /api/user/playlists/:playlistId`
            - `[DELETE] - /api/user/playlists/:playlistId/:videoId`
        - Account:
            - `[GET, POST] - /api/user/account`

## Live
[TechTv-BackEnd](http://tech-tv-back-end.vercel.app/)
