
import { AuthService } from '../auth-service';


export class ProductService {
     
    private auth: AuthService;

    constructor() {
        this.auth = new AuthService();
    }

    /**
     * @returns Promise
     */
    list(params: any): any {
             
        let url = 'catalog/product/index&page=' + params.page;

        if(params.path) {
            url += '&path=' + params.path;
        }
        
        if(params.query) {
            url += '&query=' + params.query;
        }

        return this.auth.get(url) 
    }

    /**
     * @returns Promise
     */
    view(params: any): any {
             
        let url = 'catalog/product/view';
        
        if(params.product_id)  
            url += '&product_id=' + params.product_id;
            
        if(params.sku)  
            url += '&sku=' + params.sku;
 
        return this.auth.get(url);
    }
}
 