# MARS Burger backend

1. Copy `.env.example` to `.env` and enter your MySQL credentials.
2. Run `npm.cmd run init-db` to create the database and tables.
3. Run `npm.cmd start`.
4. Open `http://localhost:3000/marsburger_SPA.html` (or any other HTML page).

`npm.cmd run dev` starts the server in watch mode. The unified order API is:

- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id`
- `DELETE /api/orders/:id`
2