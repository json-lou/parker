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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const route_controller_1 = require("./controller/route.controller");
const ride_controller_1 = require("./controller/ride.controller");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = 8080;
        const routeController = new route_controller_1.RouteController();
        const rideController = new ride_controller_1.RideController();
        app.use(body_parser_1.default.json());
        /*
        * Test Endpoint
        */
        app.get('/', (req, res) => res.send('server is running'));
        /*
        * Route Endpoints
        */
        app.post('/train-line', routeController.createTrainLine);
        app.get('/route', routeController.getRoute);
        /*
        * Ride Endpoints
        */
        app.post('/card', rideController.updateCard);
        app.post('/station/:station/enter', rideController.addEntryStation);
        app.post('/station/:station/exit', rideController.addExitStation);
        /*
        * Set up ports
        */
        app.listen(port, () => {
            console.log(`Server listening on the port ${port}`);
        });
    });
}
main();
