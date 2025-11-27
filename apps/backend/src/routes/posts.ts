import { Router, Request, Response } from "express";
import { getPosts, createPost, deletePost } from "../db/posts/posts";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const userId = req.query.userId?.toString();
  if (!userId) {
    res.status(400).send({ error: "userId is required" });
    return;
  }
  const posts = await getPosts(userId);
  res.send(posts);
});

router.post("/", async (req: Request, res: Response) => {
  const { title, body, userId } = req.body;
  if (!title || !body || !userId) {
    res.status(400).send({ error: "title, body, and userId are required" });
    return;
  }
  try {
    const result = await createPost(title, body, userId);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to create post" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    res.status(400).send({ error: "Invalid post ID" });
    return;
  }
  try {
    await deletePost(postId);
    res.send({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to delete post" });
  }
});

export default router;
