import { RideRepository } from '../repository/ride.repository';
import { RouteService } from './route.service';

export class RideService {

    private rideRepository: RideRepository;
    private routeService: RouteService;

    constructor() {
        this.rideRepository = new RideRepository();
        this.routeService = new RouteService();
    }

    /*
     * updateCard()
     *  Create card in database if doesn't exist. Otherwise, increment the existing amount
     */

    public updateCard = async(number: number, amount: number)
        : Promise<{ type: string, message: string, error: string }> => {
        try {
            // get the returned balance of the card from database
            const cards = await this.rideRepository.updateCard(number, amount);
            const newAmount = cards[0].amount;

            return {
                type: 'success',
                message: `card with id ${number} was successfully updated with a current balance of ${newAmount}`,
                error: null
            };
        }
        
        catch(e) {
            return {
                type: 'error',
                message: `card with id ${number} could not be created or updated`,
                error: e.toString()
            };
        }
    }

    /*
     * addEntryStation()
     *  Create a ride record in database and return the current balance of the card
     */

    public addEntryStation = async(cardNumber: number, entry: string)
        : Promise<{ type: string, amount: number, message: string, error: string }> => {
        try {
            const cards = await this.rideRepository.getCard(cardNumber);

            // return error if card does not exist in database
            if (cards.length === 0) {
                return {
                    type: 'error',
                    amount: null,
                    message: `card with id ${cardNumber} could not be found`,
                    error: null
                }
            }

            const rides = await this.rideRepository.getIncompleteRide(cardNumber);

            // return error if card has already started a ride
            if (rides.length > 0) {
                return {
                    type: 'error',
                    amount: null,
                    message: `card with id ${cardNumber} is already on a ride, must exit first`,
                    error: null
                }
            }

            const card = cards[0];

            // return error if card has insufficient funds
            if (card.amount <= 0) {
                return {
                    type: 'error',
                    amount: null,
                    message: `card with id ${cardNumber} does not have sufficient funds, refill before riding`,
                    error: null
                }
            }

            // create a ride record in the database
            await this.rideRepository.createRide(cardNumber, entry);
            
            return {
                type: 'success',
                amount: card.amount,
                message: null,
                error: null
            };
        }
        
        catch(e) {
            return {
                type: 'error',
                amount: null,
                message: `ride could not be created with card id ${cardNumber} at station ${entry}`,
                error: e.toString()
            }
        }
    }

    /*
     * addExitStation()
     *  Complete the ride record in database
     *  Calculate fare of the ride and update card's amount
     */

    public addExitStation = async(cardNumber: number, exit: string)
        : Promise<{ type: string, amount: number, message: string, error: string }> => {
        try {
            let cards = await this.rideRepository.getCard(cardNumber);

            // return error if card does not exist in database
            if (cards.length === 0) {
                return {
                    type: 'error',
                    amount: null,
                    message: `card with id ${cardNumber} could not be found`,
                    error: null
                }
            }

            const rides = await this.rideRepository.getIncompleteRide(cardNumber);

            // return error if card has not started a ride
            if (rides.length === 0) {
                return {
                    type: 'error',
                    amount: null,
                    message: `card with id ${cardNumber} is not on a ride, must enter first`,
                    error: null
                }
            }

            // calculate route and its fare
            const rideID = rides[0].id;
            const entry = rides[0].entry_station_name;
            const fare = await this.routeService.getRouteFare(entry, exit);
            await this.rideRepository.finishRide(rideID, exit, fare);
            
            // decrement fare from the card's balance
            await this.rideRepository.updateCard(cardNumber, -fare);
            cards = await this.rideRepository.getCard(cardNumber);
            const card = cards[0];

            return {
                type: 'success',
                amount: card.amount,
                message: null,
                error: null
            };
        }

        catch(e) {
            return {
                type: 'error',
                amount: null,
                message: `ride could not be completed with card id ${cardNumber} at station ${exit}`,
                error: e.toString()
            }
        }
    }

}
