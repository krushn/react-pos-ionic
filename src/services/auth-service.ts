
import { config } from '../config';
import { error400$, error404$, error500$, errorOffline$, logout$ } from '../services/logged-in/event-service';


export class AuthService {

    public sessionId: string = '';
    public user: string = '';
    public token: string = '';
    public currency: string = '';
    public language: string = '';
    public store_id: number | null = 0;

    constructor(
       
    ) { 
        this.loadToken();
    }

    signIn(params: any) {
        return this.post('common/login/index', params);
    }

    logout() {
        window.localStorage.removeItem('session_id');
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('currency');
        window.localStorage.removeItem('language');
        window.localStorage.removeItem('store_id');

        return this.post('common/logout/index', {});
    }

    async loadToken() {
        if (!window.localStorage.getItem('user'))
            return false;

        this.sessionId = window.localStorage.getItem('session_id') + '';
        this.user = window.localStorage.getItem('user') + '';
        this.token = window.localStorage.getItem('token') + '';
        this.currency = window.localStorage.getItem('currency') + '';
        this.language = window.localStorage.getItem('language') + '';
        //    this.store_id = parseInt(window.localStorage.getItem('store_id'));

    }

    setToken(
        data: {
            session_id: string, user: string, token: string,
            currency: string, language: string, store_id: number
        }
    ) {
        this.sessionId = data.session_id;
        this.user = data.user;
        this.token = data.token;
        this.currency = data.currency;
        this.language = data.language;
        this.store_id = data.store_id;

        window.localStorage.setItem('session_id', data.session_id);
        window.localStorage.setItem('user', data.user);
        window.localStorage.setItem('token', data.token);
        window.localStorage.setItem('currency', data.currency);
        window.localStorage.setItem('language', data.language);
        window.localStorage.setItem('store_id', data.store_id + '');
    }

    getHeaders() {
        this.loadToken();

        return {
            'Session-Id': this.sessionId,
            'Currency': 'USD',//this.currency,
            //  'Language': '1',// this.language,
            'Content-Type': 'application/json',
            'Token': this.token,
            //'Authorization': 'Bearer ' + this.token
        };
    }

    delete(endPoint: string, params: any) {
        const url = config.API + endPoint;

        return fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders(),
            body: JSON.stringify(params),
        }).then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json() // or return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => { 
            this._handleError(response);
            return Promise.reject(response)
        });
    }
    
    patch(endPoint: string, params: any) {
        const url = config.API + endPoint;

        return fetch(url, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(params),
        }).then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json() // or return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => { 
            this._handleError(response);
            return Promise.reject(response)
        });
    }

    post(endPoint: string, params: any) {
        const url = config.API + endPoint;

        return fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(params),
        }).then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json() // or return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => { 
            this._handleError(response);
            return Promise.reject(response)
        });
    }

    get(endPoint: string) {
      
        const url = config.API + endPoint;

        return fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
            // body: JSON.stringify(params),
        }).then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json() // or return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => { 
            this._handleError(response);
            return Promise.reject(response)
        });
    }

    /**
     * Handles Caught Errors from All Authorized Requests Made to Server
     */
    _handleError(error: any) {
 
        //let errMsg = (error.message) ? error.message :
        //    error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        // Handle Bad Requests
        // This error usually appears when agent attempts to handle an 
        // account that he's been removed from assigning
        if (error.status ===  400) { 
            console.error(JSON.stringify(error)); 
            error400$.next(); 
        }

        // Handle No Internet Connection Error

        if (error.status === 0 || error.status === 504) {
            return errorOffline$.next(); 
        }

        if (!navigator.onLine) {
            return errorOffline$.next(); 
        }

        // Handle Expired Session Error
        if (error.status ===  401) {
            return this.logout().then(() => { 
                logout$.next(); 
            }); 
        }

        // Handle internal server error - 500  
        if (error.status ===  500) { 
            console.error(JSON.stringify(error)); 
            return error500$.next(); 
        }

        // Handle page not found - 404 error 
        if (error.status ===  404) { 
            return error404$.next(); 
        } 
    }
} 