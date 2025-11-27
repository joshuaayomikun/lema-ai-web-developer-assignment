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
    return `${address.street}, ${address.state}, ${address.city}, ${address.zipcode}`;
  };

  return (
    <div className="w-full border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-normal text-gray-500">
              Full name
            </th>
            <th className="text-left py-3 px-4 text-sm font-normal text-gray-500">
              Email address
            </th>
            <th className="text-left py-3 px-4 text-sm font-normal text-gray-500 w-table-column">
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={3} className="py-24">
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                onClick={() => onUserClick(user)}
                className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4 text-sm text-gray-900">{user.name}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{user.email}</td>
                <td className="py-4 px-4 text-sm text-gray-900 w-table-column max-w-(--width-table-column) truncate">
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
