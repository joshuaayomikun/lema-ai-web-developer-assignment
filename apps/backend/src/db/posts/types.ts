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

// Database row type (different from API type)
export interface PostRow {
  id: number;
  user_id: number;
  title: string;
  body: string;
  created_at: string;
}
