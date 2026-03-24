# Baasil_Media

A **backend clone of LinkedIn** — a REST API that provides core social-network features: user profiles, posts, comments, replies, connections (friend requests), and likes.

## Purpose

This project implements a LinkedIn-like backend: users can create profiles, publish posts, comment and reply, send and accept connection requests, and like posts. It is API-only (no frontend) and follows an MVC-style structure with Express, Sequelize, and MySQL.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM / Database:** Sequelize with MySQL (mysql2)
- **Migrations:** Sequelize CLI

## Project Structure

```
├── config/           # App config (DB config, transaction options)
├── controllers/      # Request handlers (business logic)
├── migrations/       # Sequelize migrations
├── models/           # Sequelize models (User, Post, Comments, Replies, Connections, Likes)
├── routers/          # Route definitions
├── views/            # Response serialization (model → JSON)
├── server.js         # Entry point
└── package.json
```

## Features

| Feature | Description |
|--------|-------------|
| **Users** | Create/delete users; list users; get user with highest or second-highest post count |
| **Posts** | Create/delete posts; list all posts; per-user post count and counters |
| **Comments** | Create/delete comments on posts; post comment counters |
| **Replies** | Create/delete replies to comments; list replies by comment |
| **Connections** | Send connection requests, accept or delete; list accepted and pending connections per user |
| **Likes** | Like/unlike posts; list likes per post; duplicate like prevention |

## API Overview

### Users
- `POST /create_user` — body: `{ name, email }`
- `POST /delete_user` — body: `{ userId }`
- `GET /get_users`
- `GET /get_highest_post_count_user`
- `GET /get_second_highest_post_count_user`

### Posts
- `POST /create_post` — body: `{ title, content, userId }`
- `POST /delete_post` — body: `{ postId }`
- `GET /get_posts`

### Comments
- `POST /create_comment` — body: `{ text, userId, postId }`
- `POST /delete_comment` — body: `{ commentId }`

### Replies
- `POST /create_reply` — body: `{ text, userId, postId }` (creates comment + reply in one transaction)
- `POST /delete_reply` — body: `{ replyId, commentId }`
- `GET /get_replies?commentId=<id>` — query: `commentId` (positive integer)

### Connections
- `POST /create_connection` — body: `{ requesterId, requesteeId }`
- `POST /delete_connection` — body: `{ connectionId }`
- `POST /accept_connection` — body: `{ requesterId, requesteeId }`
- `GET /get_connections?userId=<id>` — query: `userId` (positive integer)
- `GET /get_pending_connections?userId=<id>` — query: `userId` (positive integer)

### Likes
- `POST /create_like` — body: `{ userId, postId }`
- `POST /remove_like` — body: `{ userId, postId }`
- `GET /get_likes?postId=<id>` — query: `postId` (positive integer)

Responses are JSON. Errors use `{ error: "<message>" }` with appropriate status codes (400, 404, 500). Unknown routes return `404` with `{ error: "Not found" }`.

## Setup & Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure database**  
   Edit `config/config.json` for your environment (development/test/production): set `username`, `password`, `database`, and `host` for MySQL.

3. **Run migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Server listens on `process.env.PORT` or `3000`.

## License

ISC
