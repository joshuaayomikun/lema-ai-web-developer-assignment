import { connection } from "../connection";
import { selectPostsTemplate, insertPostTemplate, deletePostTemplate } from "./query-tamplates";
import { Post, PostRow } from "./types";

const mapRowToPost = (row: PostRow): Post => ({
  id: row.id.toString(),
  title: row.title,
  body: row.body,
  userId: row.user_id.toString(),
});

export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all<PostRow>(selectPostsTemplate, [userId], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results.map(mapRowToPost));
    });
  });

export const createPost = (
  title: string,
  body: string,
  userId: string
): Promise<{ id: string }> =>
  new Promise((resolve, reject) => {
    connection.run(
      insertPostTemplate,
      [title, body, userId],
      function (this: { lastID: number }, error) {
		console.log("Insert Post Error:", error);

		console.log("Inserted Post ID:", this.lastID);
        if (error) {
          return reject(error);
        }
        resolve({ id: this.lastID.toString() });
      }
    );
  });

export const deletePost = (postId: string): Promise<void> =>
  new Promise((resolve, reject) => {
    connection.run(deletePostTemplate, [postId], (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
