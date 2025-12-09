import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
  selectUserByIdTemplate,
} from "./query-templates";
import { UserWithDetails, UserRow } from "./types";

const mapRowToUser = (row: UserRow): UserWithDetails => {
  const street = row.street || '';
  const city = row.city || '';
  const state = row.state || '';
  const zipcode = row.zipcode || '';
  
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    phone: row.phone,
    address: {
      street,
      city,
      state,
      zipcode,
      formatted: `${street}, ${city}, ${state} ${zipcode}`,
    },
  };
};

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results?.count || 0);
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
          return reject(error);
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
          return reject(error);
        }
        const validResults = (results || []).filter((row) => row !== null);
        resolve(validResults.map(mapRowToUser));
      }
    );
  });
