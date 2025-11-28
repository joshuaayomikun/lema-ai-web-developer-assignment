import crypto from 'crypto';
import { connection } from "../connection";
import { selectPostsTemplate, insertPostTemplate, deletePostTemplate } from "./query-tamplates";
import { Post, PostRow } from "./types";

// Generate a UUID without dashes (to match existing format)
const generateId = (): string => crypto.randomUUID().replace(/-/g, '');

const mapRowToPost = (row: PostRow): Post => ({
  id: row.id || '',
  title: row.title || '',
  body: row.body || '',
  userId: row.user_id || '',
});

export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all<PostRow>(selectPostsTemplate, [userId], (error, results) => {
      if (error) {
        return reject(error);
      }
      const validResults = (results || []).filter((row) => row !== null && row.id !== null);
      resolve(validResults.map(mapRowToPost));
    });
  });

export const createPost = (
  title: string,
  body: string,
  userId: string
): Promise<{ id: string }> =>
  new Promise((resolve, reject) => {
    const id = generateId();
    connection.run(
      insertPostTemplate,
      [id, title, body, userId],
      function (error) {
        if (error) {
          return reject(error);
        }
        resolve({ id });
      }
    );
  });

export const deletePost = (postId: string): Promise<void> =>
  new Promise((resolve, reject) => {
    connection.run(deletePostTemplate, [postId], (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
