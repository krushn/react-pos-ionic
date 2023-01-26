

//services
import { AuthService } from '../auth-service';


export class OrderService {
     
    private auth: AuthService;

    private endPoint =  'checkout/order/';

    constructor() {
        this.auth = new AuthService();
    }

    add(params: any) {
        let url = this.endPoint + 'add';

        return this.auth.post(url, params); 
    }
}
