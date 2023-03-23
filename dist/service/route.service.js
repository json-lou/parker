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
exports.RouteService = void 0;
const route_repository_1 = require("../repository/route.repository");
;
class RouteService {
    constructor() {
        /*
         * createTrainline()
         *  Create the trainline and add all of its stops to the database
         */
        this.createTrainline = (stations, name, fare) => __awaiter(this, void 0, void 0, function* () {
            try {
                // get lineID of newly created train from database
                const line = yield this.routeRepository.createLine(name, fare);
                const lineID = line[0].id;
                // iterate through stations, then create station and add to trainline in database
                for (let i = 0; i < stations.length; i++) {
                    yield this.routeRepository.createStation(stations[i]);
                    yield this.routeRepository.createTrainline(lineID, stations[i], i);
                }
                return {
                    type: 'success',
                    message: `line ${name} was successfully created with ID ${lineID}`,
                    error: null
                };
            }
            catch (e) {
                return {
                    type: 'error',
                    message: `could not create line ${name}`,
                    error: e.toString(),
                };
            }
        });
        /*
         * getRouteStops()
         *  Get the stop names on the calculated route
         */
        this.getRouteStops = (entry, exit) => __awaiter(this, void 0, void 0, function* () {
            try {
                const route = yield this.getRoute(entry, exit);
                // return error if no route exists between two stops
                if (route.length === 0) {
                    return {
                        type: 'error',
                        route: null,
                        message: `no possible route between ${entry} and ${exit}`,
                        error: null
                    };
                }
                // get list of stops on the route
                const stops = route.map((stop) => stop.name);
                return {
                    type: 'success',
                    route: stops,
                    message: null,
                    error: null
                };
            }
            catch (e) {
                return {
                    type: 'error',
                    route: null,
                    message: `could not calculate shortest route between ${entry} and ${exit}`,
                    error: e.toString(),
                };
            }
        });
        /*
         * getRouteFare()
         *  Get unique lineIDs from the calculated route and sum the fare for each line
         */
        this.getRouteFare = (entry, exit) => __awaiter(this, void 0, void 0, function* () {
            const route = yield this.getRoute(entry, exit);
            // throw error if no route exists between two stops
            if (route.length === 0) {
                throw new Error(`no possible route between ${entry} and ${exit}`);
            }
            // get all unique lineIDs on the route
            const lines = new Set;
            for (let stop of route) {
                if (stop.line !== null) {
                    lines.add(stop.line);
                }
            }
            // get the fare for each of the lineIDs on the route
            let fare = 0.00;
            for (let lineID of lines) {
                const lines = yield this.routeRepository.getLineFare(lineID);
                fare = fare + lines[0].fare;
            }
            return fare;
        });
        /*
         * getRoute()
         *  Use a BFS shortest path algorithm to calculate shortest path between entry and exit stops
         */
        this.getRoute = (entry, exit) => __awaiter(this, void 0, void 0, function* () {
            let graph = yield this.buildTrainlineGraph();
            let explored = [];
            let queue = [[{ name: entry, line: null }]];
            if (entry == exit) {
                return queue[0];
            }
            while (queue.length > 0) {
                let path = queue.shift();
                let node = path[path.length - 1];
                if (!explored.includes(node.name)) {
                    let neighbours = graph.get(node.name);
                    for (let neighbour of neighbours) {
                        let newPath = [...path];
                        newPath.push(neighbour);
                        queue.push(newPath);
                        if (neighbour.name === exit) {
                            return newPath;
                        }
                    }
                }
            }
            return [];
        });
        /*
         * buildTrainLineGraph()
         *  Query for stops and their respective lines from database
         *  Create a graph by storing connecting stops in adjacency lists: Map<string, Set<{station, line}>
         */
        this.buildTrainlineGraph = () => __awaiter(this, void 0, void 0, function* () {
            let graph = new Map;
            // get all of the trainlines and their stops
            const trainlines = yield this.routeRepository.getAllTrainlines();
            // iterate through the stops
            for (let i = 0; i < trainlines.length - 1; i++) {
                const stationOne = {
                    name: trainlines[i].station_name,
                    line: trainlines[i].line_id
                };
                const stationTwo = {
                    name: trainlines[i + 1].station_name,
                    line: trainlines[i + 1].line_id
                };
                // if line numbers are equal, then consecutive stops in array will be connected
                if (stationOne.line === stationTwo.line) {
                    // add stationTwo to stationOne's adjacency list
                    if (graph.has(stationOne.name)) {
                        let adjs = graph.get(stationOne.name);
                        adjs.add(stationTwo);
                    }
                    else {
                        let adjs = new Set;
                        adjs.add(stationTwo);
                        graph.set(stationOne.name, adjs);
                    }
                    // add stationOne to stationTwo's adjacency list
                    if (graph.has(stationTwo.name)) {
                        let adjs = graph.get(stationTwo.name);
                        adjs.add(stationOne);
                    }
                    else {
                        let adjs = new Set;
                        adjs.add(stationOne);
                        graph.set(stationTwo.name, adjs);
                    }
                }
            }
            return graph;
        });
        this.routeRepository = new route_repository_1.RouteRepository();
    }
}
exports.RouteService = RouteService;
