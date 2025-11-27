import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
  selectUserByIdTemplate,
} from "./query-templates";
import { UserWithDetails, UserRow } from "./types";

const mapRowToUser = (row: UserRow): UserWithDetails => ({
  id: row.id,
  name: row.name,
  username: row.username,
  email: row.email,
  phone: row.phone,
  address: {
    street: row.street || '',
    city: row.city || '',
    state: row.state || '',
    zipcode: row.zipcode || '',
  },
});

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.count);
      }
    );
  });

export const getUserById = (id: string): Promise<UserWithDetails | undefined> =>
  new Promise((resolve, reject) => {
    connection.get<UserRow>(
      selectUserByIdTemplate,
      [id],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result ? mapRowToUser(result) : undefined);
      }
    );
  });

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<UserWithDetails[]> =>
  new Promise((resolve, reject) => {
    connection.all<UserRow>(
      selectUsersTemplate,
      [pageNumber * pageSize, pageSize],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.map(mapRowToUser));
      }
    );
  });
