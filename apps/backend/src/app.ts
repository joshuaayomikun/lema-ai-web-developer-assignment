import express, { Application } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import postsRouter from "./routes/posts";
import usersRouter from "./routes/users";

export const createApp = (): Application => {
  const app: Application = express();

  // Security: Set secure HTTP headers
  app.use(helmet());

  // Security: Rate limiting - 100 requests per 15 minutes per IP
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use(limiter);

  // Security: Limit request body size to 10kb
  app.use(express.json({ limit: "10kb" }));

  // CORS configuration
  const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? "https://lema-ai-frontend-coding-test-60f713aaccb2.herokuapp.com"
    : "*";

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", allowedOrigin);
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
