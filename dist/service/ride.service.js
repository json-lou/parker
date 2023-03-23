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
exports.RideService = void 0;
const ride_repository_1 = require("../repository/ride.repository");
const route_service_1 = require("./route.service");
class RideService {
    constructor() {
        /*
         * updateCard()
         *  Create card in database if doesn't exist. Otherwise, increment the existing amount
         */
        this.updateCard = (number, amount) => __awaiter(this, void 0, void 0, function* () {
            try {
                // get the returned balance of the card from database
                const cards = yield this.rideRepository.updateCard(number, amount);
                const newAmount = cards[0].amount;
                return {
                    type: 'success',
                    message: `card with id ${number} was successfully updated with a current balance of ${newAmount}`,
                    error: null
                };
            }
            catch (e) {
                return {
                    type: 'error',
                    message: `card with id ${number} could not be created or updated`,
                    error: e.toString()
                };
            }
        });
        /*
         * addEntryStation()
         *  Create a ride record in database and return the current balance of the card
         */
        this.addEntryStation = (cardNumber, entry) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cards = yield this.rideRepository.getCard(cardNumber);
                // return error if card does not exist in database
                if (cards.length === 0) {
                    return {
                        type: 'error',
                        amount: null,
                        message: `card with id ${cardNumber} could not be found`,
                        error: null
                    };
                }
                const rides = yield this.rideRepository.getIncompleteRide(cardNumber);
                // return error if card has already started a ride
                if (rides.length > 0) {
                    return {
                        type: 'error',
                        amount: null,
                        message: `card with id ${cardNumber} is already on a ride, must exit first`,
                        error: null
                    };
                }
                const card = cards[0];
                // return error if card has insufficient funds
                if (card.amount <= 0) {
                    return {
                        type: 'error',
                        amount: null,
                        message: `card with id ${cardNumber} does not have sufficient funds, refill before riding`,
                        error: null
                    };
                }
                // create a ride record in the database
                yield this.rideRepository.createRide(cardNumber, entry);
                return {
                    type: 'success',
                    amount: card.amount,
                    message: null,
                    error: null
                };
            }
            catch (e) {
                return {
                    type: 'error',
                    amount: null,
                    message: `ride could not be created with card id ${cardNumber} at station ${entry}`,
                    error: e.toString()
                };
            }
        });
        /*
         * addExitStation()
         *  Complete the ride record in database
         *  Calculate fare of the ride and update card's amount
         */
        this.addExitStation = (cardNumber, exit) => __awaiter(this, void 0, void 0, function* () {
            try {
                let cards = yield this.rideRepository.getCard(cardNumber);
                // return error if card does not exist in database
                if (cards.length === 0) {
                    return {
                        type: 'error',
                        amount: null,
                        message: `card with id ${cardNumber} could not be found`,
                        error: null
                    };
                }
                const rides = yield this.rideRepository.getIncompleteRide(cardNumber);
                // return error if card has not started a ride
                if (rides.length === 0) {
                    return {
                        type: 'error',
                        amount: null,
                        message: `card with id ${cardNumber} is not on a ride, must enter first`,
                        error: null
                    };
                }
                // calculate route and its fare
                const rideID = rides[0].id;
                const entry = rides[0].entry_station_name;
                const fare = yield this.routeService.getRouteFare(entry, exit);
                yield this.rideRepository.finishRide(rideID, exit, fare);
                // decrement fare from the card's balance
                yield this.rideRepository.updateCard(cardNumber, -fare);
                cards = yield this.rideRepository.getCard(cardNumber);
                const card = cards[0];
                return {
                    type: 'success',
                    amount: card.amount,
                    message: null,
                    error: null
                };
            }
            catch (e) {
                return {
                    type: 'error',
                    amount: null,
                    message: `ride could not be completed with card id ${cardNumber} at station ${exit}`,
                    error: e.toString()
                };
            }
        });
        this.rideRepository = new ride_repository_1.RideRepository();
        this.routeService = new route_service_1.RouteService();
    }
}
exports.RideService = RideService;
