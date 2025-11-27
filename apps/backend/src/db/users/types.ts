export interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: Address | null;
}

export interface UserWithDetails extends User {
  username: string;
  phone: string;
  address: Address;
}

export interface UserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
}
