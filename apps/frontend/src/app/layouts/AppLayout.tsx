import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-5xl px-6">
        <Outlet />
      </div>
    </div>
  );
}
