import { db } from '../db/index';
import { QueryResult } from 'pg';

export class RouteRepository {

    public createLine = async(name: string, fare: number) => {
        const query = 'INSERT INTO lines (name, fare) VALUES ($1, $2) RETURNING id';
        const values = [name, fare];

        return db.query(query, values)
            .then((res: QueryResult) => {
                console.log('createLine: ', res.rows);
                return res.rows;
            });
    }

    public getLineFare = async(lineID: number) => {
        const query = 'SELECT (fare) FROM lines WHERE id = ($1)';
        const values = [lineID];

        return db.query(query, values)
            .then((res: QueryResult) => {
                console.log('getLineFare: ', res.rows);
                return res.rows;
            });
    }

    public createStation = async(station: string) => {
        const values = [station];
        const query = 'INSERT INTO stations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING';

        return db.query(query, values)
            .then((res: QueryResult) => {
                console.log('createStation: ', res.rows);
                return res.rows;
            });
    }

    public createTrainline = async(lineID: number, station: string, sequence: number) => {
        const query = 'INSERT INTO trainlines (line_id, station_name, sequence) VALUES ($1, $2, $3)';
        const values = [lineID, station, sequence];

        return db.query(query, values)
            .then((res: QueryResult) => {
                console.log('createTrainline: ', res.rows);
                return res.rows;
            });
    }

    public getAllTrainlines = async() => {
        const query = 'SELECT * FROM trainlines ORDER BY (line_id, sequence)';

        return db.query(query, [])
            .then((res: QueryResult) => {
                console.log('getAllTrainlines: ', res.rows);
                return res.rows;
            });
    }

}
