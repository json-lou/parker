import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'postgres',
    password: 'password',
    port: 5432,
});

export const db = {
    query: (text: string, params: any) => {
        return pool.query(text, params);
    }
};
