"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRepository = void 0;
const index_1 = require("../db/index");
class RideRepository {
    constructor() {
        this.updateCard = (number, amount) => __awaiter(this, void 0, void 0, function* () {
            const query = `
            INSERT INTO cards (number, amount)
                VALUES ($1, $2)
            ON CONFLICT (number) DO UPDATE
                SET amount = cards.amount + ($2) RETURNING amount
        `;
            const values = [number, amount];
            return index_1.db.query(query, values)
                .then((res) => {
                console.log('updateCard: ', res.rows);
                return res.rows;
            });
        });
        this.getCard = (number) => __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM cards WHERE number = ($1)';
            const values = [number];
            return index_1.db.query(query, values)
                .then((res) => {
                console.log('getCard: ', res.rows);
                return res.rows;
            });
        });
        this.createRide = (number, entry) => __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO rides (entry_station_name, card_number) VALUES ($1, $2) RETURNING id';
            const values = [entry, number];
            return index_1.db.query(query, values)
                .then((res) => {
                console.log('createRide: ', res.rows);
                return res.rows;
            });
        });
        this.getIncompleteRide = (number) => __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM rides WHERE card_number = ($1) AND exit_station_name IS NULL';
            const values = [number];
            return index_1.db.query(query, values)
                .then((res) => {
                console.log('getIncompleteRide: ', res.rows);
                return res.rows;
            });
        });
        this.finishRide = (rideID, exit, fare) => __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE rides SET exit_station_name = ($1), fare = ($2) WHERE id = ($3)';
            const values = [exit, fare, rideID];
            return index_1.db.query(query, values)
                .then((res) => {
                console.log('finishRide: ', res.rows);
                return res.rows;
            });
        });
    }
}
exports.RideRepository = RideRepository;
