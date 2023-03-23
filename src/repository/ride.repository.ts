import { QueryResult } from 'pg';
import { db } from '../db/index';

export class RideRepository {

    public updateCard = async(number: number, amount: number) => {
        const query = `
            INSERT INTO cards (number, amount)
                VALUES ($1, $2)
            ON CONFLICT (number) DO UPDATE
                SET amount = cards.amount + ($2) RETURNING amount
        `;
        const values = [number, amount];

        return db.query(query, values)
            .then((res: QueryResult) => {
                console.log('updateCard: ', res.rows);
                return res.rows;
            });
    }

    public getCard = async(number: number) => {
        const query = 'SELECT * FROM cards WHERE number = ($1)';
        const values = [number];

        return db.query(query, values)
            .then((res: QueryResult) => {
                console.log('getCard: ', res.rows);
                return res.rows;
            });
    }

    public createRide = async(number: number, entry: string) => {
        const query = 'INSERT INTO rides (entry_station_name, card_number) VALUES ($1, $2) RETURNING id';
        const values = [entry, number];

        return db.query(query, values)
            .then((res: QueryResult) => {
                console.log('createRide: ', res.rows);
                return res.rows;
            });
    }

    public getIncompleteRide = async(number: number) => {
        const query = 'SELECT * FROM rides WHERE card_number = ($1) AND exit_station_name IS NULL';
        const values = [number];

        return db.query(query, values)
            .then((res: QueryResult) => {
                console.log('getIncompleteRide: ', res.rows);
                return res.rows;
            });
    }

    public finishRide = async(rideID: number, exit: string, fare: number) => {
        const query = 'UPDATE rides SET exit_station_name = ($1), fare = ($2) WHERE id = ($3)';
        const values = [exit, fare, rideID];

        return db.query(query, values)
            .then((res: QueryResult) => {
                console.log('finishRide: ', res.rows);
                return res.rows;
            });
    }

}
