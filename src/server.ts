import express from "express";
import bodyParser from 'body-parser';

import { RouteController } from './controller/route.controller';
import { RideController } from './controller/ride.controller';

async function main() {
    const app = express();
    const port = 8080;

    const routeController = new RouteController();
    const rideController = new RideController();

    app.use(bodyParser.json());

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
}

main();
