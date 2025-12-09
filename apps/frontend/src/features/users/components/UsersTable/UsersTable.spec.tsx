import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { UsersTable } from './UsersTable';
import { User } from '../../types';

// Mock the LoadingSpinner component
vi.mock('@web-developer-assignment/ui', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe('UsersTable', () => {
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
        formatted: '123 Main St, New York, NY 10001',
      },
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipcode: '90001',
        formatted: '456 Oak Ave, Los Angeles, CA 90001',
      },
    },
  ];

  const mockOnUserClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the table headers', () => {
    render(
      <UsersTable
        users={mockUsers}
        onUserClick={mockOnUserClick}
        isLoading={false}
      />
    );

    expect(screen.getByText('Full name')).toBeInTheDocument();
    expect(screen.getByText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('should render user data in the table', () => {
    render(
      <UsersTable
        users={mockUsers}
        onUserClick={mockOnUserClick}
        isLoading={false}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, New York, NY 10001')).toBeInTheDocument();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should call onUserClick when a row is clicked', async () => {
    const user = userEvent.setup();
    render(
      <UsersTable
        users={mockUsers}
        onUserClick={mockOnUserClick}
        isLoading={false}
      />
    );

    const row = screen.getByText('John Doe').closest('tr');
    expect(row).toBeInTheDocument();
    
    await user.click(row!);
    
    expect(mockOnUserClick).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should show loading spinner when isLoading is true', () => {
    render(
      <UsersTable
        users={[]}
        onUserClick={mockOnUserClick}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    // Table header is still visible when loading, only body shows spinner
    expect(screen.getByText('Full name')).toBeInTheDocument();
  });

  it('should handle users without address', () => {
    const usersWithoutAddress: User[] = [
      {
        id: '3',
        name: 'No Address User',
        email: 'noaddr@example.com',
        address: null,
      },
    ];

    render(
      <UsersTable
        users={usersWithoutAddress}
        onUserClick={mockOnUserClick}
        isLoading={false}
      />
    );

    expect(screen.getByText('No Address User')).toBeInTheDocument();
    expect(screen.getByText('noaddr@example.com')).toBeInTheDocument();
  });

  it('should render empty table when no users provided', () => {
    render(
      <UsersTable
        users={[]}
        onUserClick={mockOnUserClick}
        isLoading={false}
      />
    );

    expect(screen.getByText('Full name')).toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /john/i })).not.toBeInTheDocument();
  });
});
