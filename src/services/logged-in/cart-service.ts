


//services
import { AuthService } from '../auth-service';


export class CartService {
     
    private auth: AuthService;

    private endPoint =  'checkout/cart/';

    constructor() {
        this.auth = new AuthService();
    }

    /**
     * @returns Promise
     */
    listCartProducts(): any {
             
        let url = this.endPoint + 'products';

        return this.auth.get(url);
    } 

    /**
     * @returns Promise
     */
    addCartProduct(params: any): any {
             
        let url = this.endPoint + 'add';

        return this.auth.post(url, params);
    }

    /**
     * @returns Promise
     */
    editCartProduct(params: any): any {
             
        let url = this.endPoint + 'edit';

        return this.auth.post(url, params);
    }

    /**
     * @returns Promise
     */
    removeCartProduct(cart_id: string): any {
             
        let url = this.endPoint + 'remove';

        return this.auth.delete(url, { cart_id: cart_id });
    }
}
 