import React, { useContext, useState } from 'react';
import './Cart.css';
import { IonGrid, IonRow, IonCol, IonNote, IonButton, IonThumbnail, IonIcon, IonList, IonImg, IonLabel, IonItem, isPlatform, IonModal, IonSkeletonText, IonSpinner } from '@ionic/react';
import { remove, trashOutline, add, refreshCircleOutline, printOutline, cartOutline } from 'ionicons/icons';
import { CheckoutOption } from '../checkout-option/checkout-option';
import { AppContext, setState, loadCart } from '../../State';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { cartLoading$ } from '../../services/logged-in/event-service';
//services
import { CartService } from '../../services/logged-in/cart-service';
import { OrderService } from '../../services/logged-in/order-service';


export const Cart = (prop) => {

  const { state, dispatch } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const cartService = new CartService();
  const orderService = new OrderService();
 
  cartLoading$.subscribe((status: boolean) => {
    setLoading(status);
  }); 
 
  const loadProducts = async () => { 

    setLoading(true);

    let data = await cartService.listCartProducts();

    dispatch(loadCart(data)) 
 
    setLoading(false);
  }

  const handleItemDelete = (key: string) => {

    setLoading(true);

    cartService.removeCartProduct(key).then((data: any) => {

      setLoading(false);

      if (data.success) {
        loadProducts();
      }
    }, () => {

      setLoading(false);
    });
  }

  /**
   * @returns null
   */
  const handlePlusQty = (product: any) => {

    product.quantity++;

    update(product);
  }

  const handleMinusQty = (product: any) => {
    if (product.quantity > 1)
      product.quantity--;

    update(product);
  }

  /**
   * update cart 
   */
  const update = (product: any) => {

    let params = {
      cart_id: product.cart_id,
      quantity: product.quantity
    }

    setLoading(true);

    cartService.editCartProduct(params).then((data: any) => {

      setLoading(false);

      if (data.success) {
        loadProducts();
      }
    }, () => {

      setLoading(false);
    });
  }

  /**
   * submit order detail to backend 
   * @param data 
   */
  const placeOrder = (data: any) => {

    setPlacingOrder(true);

    let params = {
      customer_id: data.customer_id,
      'customer_group_id': data.customer_group_id,
      'firstname': data.firstname,
      'lastname': data.lastname,
      'email': data.email,
      'telephone': data.telephone,
      'payment_method': data.payment_method ? data.payment_method : 'Cash on Counter',
      'payment_code': data.payment_code ? data.payment_code : 'cash_on_counter',
      'shipping_firstname': data.shipping_firstname,
      'shipping_lastname': data.shipping_lastname,
      'shipping_company': data.shipping_company,
      'shipping_address_1': data.shipping_address_1,
      'shipping_address_2': data.shipping_address_2,
      'shipping_city': data.shipping_city,
      'shipping_postcode': data.shipping_postcode,
      'shipping_zone': data.shipping_zone,
      'shipping_zone_id': data.shipping_zone_id,
      'shipping_country': data.shipping_country,
      'shipping_country_id': data.shipping_country_id,
      'shipping_address_format': data.shipping_address_format,
      'shipping_custom_field': [],
      'shipping_method': data.shipping_method,
      'shipping_code': data.shipping_code,
      comment: data.comment
    };

    orderService.add(params).then((data: any) => {

      //hide products 

      let grid = document.getElementById('grid-home-page');

      grid?.classList.add('have-order');

      setPlacingOrder(false);

      if (data.success) {
        dispatch(setState({
          order: data.order,
          error: [],
          barcode: ''
        }));

        //printOrder();
      } else {
        console.log(data);
      }
    }, () => {
      setPlacingOrder(false);
    });
  }

  /**
   * print invoice 
   */
  const printOrder = () => {

    if (isPlatform('capacitor')) {

      Printer.isAvailable().then(() => {

        let options: PrintOptions = {
          name: state.order.invoice_prefix,
          //printerId: 'printer007',
          duplex: true,
          // landscape: true,
          // grayscale: true
        }

        let content = "";

        Printer.print(content, options).then(() => {
          // console.error('Printer  - ' + JSON.stringify(err));
        }, (err: any) => {
          console.error('Printer error - ' + JSON.stringify(err));
        });

      }, (err: any) => {
        console.error('Printer error - ' + JSON.stringify(err));
      });
    } else {
      window.print();
    }
  }

  const newOrder = () => {

    //show products 

    let grid = document.getElementById('grid-home-page');

    grid?.classList.remove('have-order');

    dispatch(setState({
      cart_items: [],
      vouchers: [],
      totals: [],
      error: [],
      barcode: '',
      order: null,
    }));

    let a = document.getElementById('inp-scanner') as HTMLIonSearchbarElement;

    a.setFocus();
  }

  return (
    <div className={"cart-container " + (state.order ? 'haveOrder' : '')}>

      <IonModal id="checkout-modal" isOpen={showModal} onDidDismiss={(e) => {
        if (e.detail.data) {
          placeOrder(e.detail.data);
        }

        setShowModal(false);
      }}>
        {
          <CheckoutOption />
        }
      </IonModal>

      <OrderSuccess order={state.order} />

      {
        state.order ? <div className="hidden-print order-action">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand="full" onClick={() => { newOrder() }}>
                  <IonIcon icon={refreshCircleOutline}></IonIcon>&nbsp; Reset
                  </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="full" color="secondary" onClick={() => { printOrder() }}>
                  <IonIcon icon={printOutline}></IonIcon>&nbsp;Print Invoice
                  </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div> : null
      }

      <div className="hidden-print">
        <CartErrors errors={state.error} />
      </div>

      {
        loading ? <IonSkeletonText animated /> : null
      }

      <IonList lines="none">

        {
          state.cart_items.length === 0 ?
            <div className="cart-empty">
              <IonIcon icon={cartOutline} />
            </div> : null
        }

        {
          state.cart_items.map((product: any, index: number) => (

            <IonItem key={'cart-item-' + index}>

              <IonThumbnail slot="start">
                <IonImg src={product.thumb} />
              </IonThumbnail>

              <IonLabel>
                <h4>
                  <span dangerouslySetInnerHTML={{ __html: product.name }}></span>

                  {
                    !product.stock ?
                      <span className="no-stock">***</span>
                      : null
                  }
                </h4>

                <p>{product.total}</p>

                <ProductOptions options={product.options} />

                <ProductReward options={product.reward} />

                <ProductRecurring options={product.recurring} />

                <div className="actions hidden-print">
                  <div className="btn-quantity-wrapper">
                    <IonButton color="secondary" onClick={() => { handleMinusQty(product) }} className="btn-minus">
                      <IonIcon slot="icon-only" icon={remove}></IonIcon>
                    </IonButton>
                    <span className="count">{product.quantity}</span>
                    <IonButton color="secondary" onClick={() => { handlePlusQty(product) }} className="btn-plus">
                      <IonIcon slot="icon-only" icon={add}></IonIcon>
                    </IonButton>
                  </div>
                  <IonButton color="danger" onClick={() => { handleItemDelete(product.cart_id) }} className="btn-remove">
                    <IonIcon slot="icon-only" icon={trashOutline}></IonIcon>
                  </IonButton>
                </div>

              </IonLabel>

            </IonItem>
          ))
        }

        {
          state.vouchers.map((voucher: any, index: number) => (
            <IonItem key={'cart-voucher-' + index}>
              <IonLabel>
                <h4>{voucher.description}</h4>
                <p>{voucher.amount}</p>

                <div className="actions">

                  <IonButton onClick={() => { handleItemDelete(voucher.cart_id) }} className="btn-remove">
                    <IonIcon slot="icon-only" icon={trashOutline}></IonIcon>
                  </IonButton>

                </div>
              </IonLabel>
            </IonItem>
          ))
        }
      </IonList>

      {
        state.totals.map((total: any, index: number) => (
          <IonList className="summary" key={'cart-total-' + index} lines="none">
            <IonItem>
              <IonLabel>{total.title}</IonLabel>
              <IonNote slot="end">{total.text}</IonNote>
            </IonItem>
          </IonList>
        ))

        //text_empty && (!products || products.length == 0)

      }

      <IonButton disabled={
        state.cart_items.length === 0 ||
        state.placingPrder ||
        (state.errors && state.errors.length > 0)
      } expand="full" className="btn-place-order hidden-print"
        onClick={() => { setShowModal(true) }}>
        {
          placingOrder ? <IonSpinner></IonSpinner> : 'Place Order'
        }
      </IonButton>

    </div>
  )
}

function ProductReward(props: any) {

  if (!props.reward)
    return null;

  return (
    <div className="recurring">
      {props.reward}
    </div>
  );
}

function ProductRecurring(props: any) {

  if (!props.recurring)
    return null;

  return (
    <div className="recurring">
      {props.recurring}
    </div>
  );
}

function ProductOptions(props: any) {
  const options = props.options;

  if (!options)
    return null;

  return (
    <div className="options">
      {
        options.map((pOption: any) => (
          <p key={'item-option-' + pOption.option_id}>
            {pOption.name} : { pOption.value}
          </p>
        ))
      }
    </div>
  );
}

function OrderSuccess(props: any) {

  if (!props.order)
    return null;

  return (
    <div className="order-detail">
      <p className="alert alert-success order-sucess hidden-print">
        Order placed with id #{props.order.order_id}!
      </p>

      <div className="print-only">
        <h2>{props.order.store_name}</h2>
        <p>Invoice no. : {props.order.invoice_prefix}</p>
        <p>Order No. : {props.order.order_id}</p>

        <p>Name : {props.order.firstname}&nbsp;{props.order.lastname}</p>
        <p>Email : {props.order.email}</p>
        <p>Telephone : {props.order.telephone}</p>
      </div>
    </div>

  );
}

function CartErrors(props: any) {
  const errors = props.errors;

  if (!errors || errors.length === 0)
    return null;

  return (
    <div className="options">
      {
        <p className="alert alert-warning">
          {errors.stock}
        </p>
      }
    </div>
  );
}

