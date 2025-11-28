import config from "config";
import { createApp } from "./app";

// Use PORT from environment (for Heroku) or fall back to config
const port = process.env.PORT || (config.get("port") as number);

const app = createApp();

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});

