export interface Post {
  id: string;
  title: string;
  body: string;
  userId: string;
}

export interface CreatePostInput {
  title: string;
  body: string;
  userId: string;
}
