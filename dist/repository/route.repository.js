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
exports.RouteRepository = void 0;
const index_1 = require("../db/index");
class RouteRepository {
    constructor() {
        this.createLine = (name, fare) => __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO lines (name, fare) VALUES ($1, $2) RETURNING id';
            const values = [name, fare];
            return index_1.db.query(query, values)
                .then((res) => {
                console.log('createLine: ', res.rows);
                return res.rows;
            });
        });
        this.getLineFare = (lineID) => __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT (fare) FROM lines WHERE id = ($1)';
            const values = [lineID];
            return index_1.db.query(query, values)
                .then((res) => {
                console.log('getLineFare: ', res.rows);
                return res.rows;
            });
        });
        this.createStation = (station) => __awaiter(this, void 0, void 0, function* () {
            const values = [station];
            const query = 'INSERT INTO stations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING';
            return index_1.db.query(query, values)
                .then((res) => {
                console.log('createStation: ', res.rows);
                return res.rows;
            });
        });
        this.createTrainline = (lineID, station, sequence) => __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO trainlines (line_id, station_name, sequence) VALUES ($1, $2, $3)';
            const values = [lineID, station, sequence];
            return index_1.db.query(query, values)
                .then((res) => {
                console.log('createTrainline: ', res.rows);
                return res.rows;
            });
        });
        this.getAllTrainlines = () => __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM trainlines ORDER BY (line_id, sequence)';
            return index_1.db.query(query, [])
                .then((res) => {
                console.log('getAllTrainlines: ', res.rows);
                return res.rows;
            });
        });
    }
}
exports.RouteRepository = RouteRepository;
