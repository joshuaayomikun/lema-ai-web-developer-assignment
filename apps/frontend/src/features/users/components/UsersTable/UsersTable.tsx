import { User } from '../../types';
import { LoadingSpinner } from '@web-developer-assignment/ui';

interface UsersTableProps {
  users: User[];
  onUserClick: (user: User) => void;
  isLoading?: boolean;
}

export function UsersTable({ users, onUserClick, isLoading }: UsersTableProps) {
  const formatAddress = (address: User['address']) => {
    if (!address) return '';
    return `${address.street}, ${address.city}, ${address.state} ${address.zipcode}`;
  };

  return (
    <div className="w-full border border-slate-200 rounded-lg overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-normal text-gray-500 whitespace-nowrap">
              Full name
            </th>
            <th className="text-left py-3 px-4 text-sm font-normal text-gray-500 whitespace-nowrap">
              Email address
            </th>
            <th className="text-left py-3 px-4 text-sm font-normal text-gray-500 w-table-column whitespace-nowrap">
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={3} className="h-[212px]">
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr
                key={user.id}
                onClick={() => onUserClick(user)}
                className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors animate-fade-in"
              >
                <td className="py-4 px-4 text-sm text-gray-900 whitespace-nowrap">{user.name}</td>
                <td className="py-4 px-4 text-sm text-gray-900 whitespace-nowrap">{user.email}</td>
                <td className="py-4 px-4 text-sm text-gray-900 w-table-column max-w-[392px] truncate">
                  {formatAddress(user.address)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
