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
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
}
