import { Route, Routes } from 'react-router-dom';
import { UsersPage } from '../features/users';
import { UserPostsPage } from '../features/posts';
import { AppLayout } from './layouts';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<UsersPage />} />
        <Route path="/users/:userId/posts" element={<UserPostsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
