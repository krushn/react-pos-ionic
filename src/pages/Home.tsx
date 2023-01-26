import { IonContent, IonHeader, IonGrid, IonRow, IonCol, IonPage, IonTitle, IonIcon, IonToolbar, IonButtons, IonButton } from '@ionic/react';
import React, { useContext } from 'react';
import './Home.scss';
import { powerOutline } from 'ionicons/icons';
import { AppContext, logout, loadCart, loadProducts, setState } from '../State';
import { useHistory } from 'react-router';
//services
import { error400$, error404$, error500$, errorOffline$, logout$ } from '../services/logged-in/event-service';
//components 
import { Products } from '../components/products/Products';
import { Cart } from '../components/cart/Cart';
import { CartService } from '../services/logged-in/cart-service';
import { ProductService } from '../services/logged-in/product-service';

 
export const Home: React.FC = (props: any) => {

  const { state, dispatch } = useContext(AppContext);
  
  /**
   * load initial data 
   */
  if(!state.initialized) {
    const cartService = new CartService();
    const productService = new ProductService();

    Promise.all([
      cartService.listCartProducts(),
      productService.list({ page : 1 })
    ]).then(data => {
      dispatch(loadCart(data[0]));
      dispatch(setState({ nbPages: data[1].nbPages, initialized: true }));
      dispatch(loadProducts(data[1]));
    }); 
  }

  const history = useHistory();
   
  const doLogout = () => {

    history.replace('/login');

    dispatch(logout);
  }

  logout$.subscribe(() => {
    history.push('/login');
  });
  
  errorOffline$.subscribe(() => {
    history.push('/offline');
  });
  
  error404$.subscribe(() => {
    history.push('/error-404');
  });
  
  error500$.subscribe(() => {
    history.push('/error-500');
  });
  
  error400$.subscribe(() => { 
    history.push('/error-400');
  });
   
  return (
    <IonPage>
      <IonHeader className="hidden-print">
        <IonToolbar>
          <IonTitle>POS v 1.0</IonTitle>

          <IonButtons slot="end" className="hidden-print">
            <IonButton fill="clear" onClick={() => doLogout() }>
              Logout &nbsp; <IonIcon icon={powerOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <IonGrid id="grid-home-page">
          <IonRow>
            <IonCol sizeXs="12" sizeSm="6" sizeLg="6" className="col-product hidden-print">
              <Products />
            </IonCol>
            <IonCol sizeXs="12" sizeSm="6" sizeLg="6" className="col-cart">
              <Cart />
            </IonCol>
          </IonRow>
        </IonGrid>
 
      </IonContent>
    </IonPage>
  );
};

export default Home;
