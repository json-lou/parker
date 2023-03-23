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
exports.RideController = void 0;
const ride_service_1 = require("../service/ride.service");
class RideController {
    constructor() {
        this.updateCard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { number, amount } = req.body;
            const { type, message, error } = yield this.rideService.updateCard(number, amount);
            if (type === 'error') {
                return res.status(400).json({ message, error });
            }
            return res.status(200).json({ message });
        });
        this.addEntryStation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cardNumber = req.body.card_number;
            const entry = req.params.station;
            const { type, amount, message, error } = yield this.rideService.addEntryStation(cardNumber, entry);
            if (type === 'error') {
                return res.status(400).json({ message, error });
            }
            return res.status(200).json({ amount });
        });
        this.addExitStation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cardNumber = req.body.card_number;
            const exit = req.params.station;
            const { type, amount, message, error } = yield this.rideService.addExitStation(cardNumber, exit);
            if (type === 'error') {
                return res.status(400).json({ message, error });
            }
            return res.status(200).json({ amount });
        });
        this.rideService = new ride_service_1.RideService();
    }
}
exports.RideController = RideController;
