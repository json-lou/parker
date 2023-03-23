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
exports.RouteController = void 0;
const route_service_1 = require("../service/route.service");
class RouteController {
    constructor() {
        this.createTrainLine = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { stations, name, fare } = req.body;
            const { type, message, error } = yield this.routeService.createTrainline(stations, name, fare);
            if (type === 'error') {
                return res.status(400).json({ message, error });
            }
            return res.status(200).json({ message });
        });
        this.getRoute = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { origin, destination } = req.query;
            const { type, route, message, error } = yield this.routeService.getRouteStops(origin, destination);
            if (type === 'error') {
                return res.status(400).json({ message, error });
            }
            return res.status(200).json({ route });
        });
        this.routeService = new route_service_1.RouteService();
    }
}
exports.RouteController = RouteController;
