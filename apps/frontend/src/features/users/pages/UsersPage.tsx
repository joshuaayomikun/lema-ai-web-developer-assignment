import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUsers, useUsersCount } from '../hooks';
import { UsersTable } from '../components';
import { Pagination } from '@web-developer-assignment/ui';
import { User } from '../types';

const PAGE_SIZE = 4;

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get current page from URL query params, default to 1
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useUsers({
    pageNumber: currentPage - 1, // API uses 0-based pagination
    pageSize: PAGE_SIZE,
  });

  const { data: countData } = useUsersCount();

  const totalPages = countData ? Math.ceil(countData.count / PAGE_SIZE) : 0;

  const handleUserClick = (user: User) => {
    const pageParam = currentPage > 1 ? `?fromPage=${currentPage}` : '';
    navigate(`/users/${user.id}/posts${pageParam}`);
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  if (usersError) {
    return (
      <div className="py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Users</h1>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">
            Failed to load users. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Users</h1>

        <UsersTable
          users={usersData || []}
          onUserClick={handleUserClick}
          isLoading={isLoadingUsers}
        />

        {totalPages > 1 && (
          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
