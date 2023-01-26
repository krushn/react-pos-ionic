import React, { createContext, useReducer } from "react";
//services
import { AuthService } from "./services/auth-service"; 


let AppContext = createContext(null);

const initialState = {
  cart_items: [],
  products: [],
  nbPages: 0,
  categories: [],
  category_path: 0,
  options: [],
  recurrings: [],
  product_id: null,
  vouchers: [],
  totals: [],
  barcode: '',
  order: null,
  initialized: false
}

const authService = new AuthService();

let reducer = (state, action) => {

  switch (action.type) {

    case "SET_STATE": {
      let a = { ...state, ...action.data };
      return a; 
    }
    case 'LOGOUT': {

      authService.logout();

      return { ...state, isLoggedIn: false };
    }
    case "SET_TOKEN": {

      authService.setToken(action);
      
      return { 
        ...state, 
        products: action.products,
        categories: action.categories,
        cart_items: action.products,
        vouchers: action.vouchers,
        totals: action.totals,
        error: action.error, 
        isLoggedIn: true 
      }; 
    }
    case "LOAD_PRODUCTS": {
      return { 
        ...state, 
        products: action.products,
        categories: action.categories,
      };
    }
    case "LOAD_CART_ITEMS": {

      return { 
        ...state, 
        cart_items: action.products,
        vouchers: action.vouchers,
        totals: action.totals,
        error: action.error 
      };  
    }
  }
  return state;
};

function AppContextProvider(props) {

  const fullInitialState = {
    ...initialState,
  }

  let [state, dispatch] = useReducer(reducer, fullInitialState);

  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };

export const logout = () => ({
  type: 'LOGOUT'
});

export const setState = (data) => ({
  data: data,
  type: 'SET_STATE'
});

export const loggedIn = (data) => ({
  ...data,
  type: 'SET_TOKEN', 
});

export const loadProducts = (data) => ({
  ...data,
  type: 'LOAD_PRODUCTS'
});

export const loadCart = (data) => ({
  ...data,
  type: 'LOAD_CART_ITEMS'
});