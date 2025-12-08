import { Router, Request, Response } from "express";

import { getUsers, getUsersCount, getUserById } from "../db/users/users";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const pageNumber = Number(req.query.pageNumber) || 0;
  const pageSize = Number(req.query.pageSize) || 4;
  if (pageNumber < 0 || pageSize < 1) {
    res.status(400).send({ message: "Invalid page number or page size" });
    return;
  }

  try {
    const users = await getUsers(pageNumber, pageSize);
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users" });
  }
});

router.get("/count", async (req: Request, res: Response) => {
  try {
    const count = await getUsersCount();
    res.send({ count });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users count" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch user" });
  }
});

export default router;
