import { RouteService } from '../service/route.service';

export class RouteController {

    private routeService: RouteService;

    constructor() {
        this.routeService = new RouteService();
    }
    
    public createTrainLine = async(req: any, res: any) : Promise<any> => {
        const { stations, name, fare } = req.body;
        const { type, message, error } = await this.routeService.createTrainline(stations, name, fare);
    
        if (type === 'error') {
            return res.status(400).json({ message, error });
        }
        
        return res.status(200).json({ message });
    }
    
    public getRoute = async(req: any, res: any) : Promise<any> => {
        const { origin, destination } = req.query;
        const { type, route, message, error } = await this.routeService.getRouteStops(origin, destination);
    
        if (type === 'error') {
            return res.status(400).json({ message, error });
        }
    
        return res.status(200).json({ route });
    }

}
