export interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  formatted: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: Address | null;
}

export interface UserCountResponse {
  count: number;
}
