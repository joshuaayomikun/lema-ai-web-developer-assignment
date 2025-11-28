import express, { Application } from "express";
import postsRouter from "./routes/posts";
import usersRouter from "./routes/users";

export const createApp = (): Application => {
  const app: Application = express();

  // Parse JSON request bodies
  app.use(express.json());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // Health check endpoint
  app.get("/", (req, res) => {
    res.json({ status: "ok", message: "API is running" });
  });

  app.use("/posts", postsRouter);
  app.use("/users", usersRouter);

  return app;
};
