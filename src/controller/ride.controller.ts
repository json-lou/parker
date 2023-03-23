import { RideService } from '../service/ride.service';

export class RideController {

    private rideService: RideService;

    constructor() {
        this.rideService = new RideService();
    }

    public updateCard = async(req: any, res: any) : Promise<any> => {
        const { number, amount } = req.body;
        const { type, message, error } = await this.rideService.updateCard(number, amount);

        if (type === 'error') {
            return res.status(400).json({ message, error });
        }

        return res.status(200).json({ message })
    }

    public addEntryStation = async(req: any, res: any) : Promise<any> => {
        const cardNumber = req.body.card_number;
        const entry = req.params.station;

        const { type, amount, message, error } = await this.rideService.addEntryStation(cardNumber, entry);

        if (type === 'error') {
            return res.status(400).json({ message, error });
        }

        return res.status(200).json({ amount });
    }

    public addExitStation = async(req: any, res: any) : Promise<any> => {
        const cardNumber = req.body.card_number;
        const exit = req.params.station;

        const { type, amount, message, error } = await this.rideService.addExitStation(cardNumber, exit);

        if (type === 'error') {
            return res.status(400).json({ message, error });
        }

        return res.status(200).json({ amount });
    }

}
