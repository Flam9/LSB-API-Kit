import mariadb from 'mariadb';
import dotenv from 'dotenv';

// Load env variables from .env file
dotenv.config();

let pool: mariadb.Pool;

/**
 * Closes the Database pool.
 * @param {function} onClose - Function to call when the pool is successfull closed
 */
export const initDbConnection = () => {
  // Create a mariadb pool
  pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    database: process.env.DB,
    connectionLimit: 10,
    // For easier debugging in development
    // https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#enable-trace-option-in-development
    trace: true,
    // COUNT(*) returns BigInt
    // We shouldn't need such large numbers and they're more annoying to dev for
    // https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#migrating-from-2x-or-mysqlmysql2-to-3x
    insertIdAsNumber: true,
    bigIntAsNumber: true,
  });
};

/**
 * Closes the Database pool.
 * @param {function} onClose - Function to call when the pool is successfull closed
 */
export const closeDbConnection = (onClose: () => void) => {
  pool
    .end()
    .then(() => {
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    })
    .catch((error) => console.log(error));
};

/**
 * Helper function to execute queries on the db
 * Handles opening and closing connections to the pool
 *
 * @param {string} statement - The SQL query to run
 * @param {any[]} values - Values passed into the SQL query, replacing instances of '?'
 */
export const query = async <T>(statement: string, values: any[] = []): Promise<T[]> => {
  return new Promise(async (resolve, reject) => {
    if (!statement) {
      reject('You must provide a statement.');
      return;
    }
    if (!pool) {
      reject('You must initialize a db connection with "initDbConnection"');
      return;
    }

    let conn;
    try {
      conn = await pool.getConnection();
      const response = await conn.execute(statement, values);
      // Too noisy
      if (response.meta) {
        delete response.meta;
      }

      if (conn) {
        conn.release();
      }
      resolve(response);
    } catch (error) {
      if (conn) {
        conn.release();
      }
      reject(error);
    }
  });
};
