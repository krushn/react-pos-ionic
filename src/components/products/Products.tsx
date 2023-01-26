import React, { useContext, useState } from 'react';
import './Products.scss';
import { IonGrid, IonRow, IonCol, IonButton, IonModal, IonSearchbar, IonThumbnail, IonImg, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonSkeletonText, isPlatform, IonAlert } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { ProductOption } from '../product-option/ProductOption';
import { AppContext, setState, loadCart } from '../../State';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'; 
import { cartLoading$ } from '../../services/logged-in/event-service';
//services
import { ProductService } from '../../services/logged-in/product-service';
import { CartService } from '../../services/logged-in/cart-service';


export const Products = (props) => {

  const { state, dispatch } = useContext(AppContext);
  const [query, setQuery] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showProductLoader, setShowProductLoader] = useState(false);
  const [errors, setErrors] = useState(null);

  const ionInfiniteScrollRef: React.RefObject<HTMLIonInfiniteScrollElement> = React.createRef<HTMLIonInfiniteScrollElement>();

  const productService = new ProductService();
  const cartService = new CartService();

  const loadProducts = (query = null, path = 0, page = 1) => {

    let params = {
      query: query,
      path: path,
      page: page
    };

    setPage(page);

    setShowProductLoader(true);

    productService.list(params).then((data: any) => {

      let products = page === 1 ? data.products : state.products.concat(data.products);

      setShowProductLoader(false);

      dispatch(setState({
        nbPages: data.nbPages,
        products: products,
        categories: data.categories,
        category_path: path
      }));
    }).catch(() => {
      setShowProductLoader(false);
    });
  }

  const loadMoreProducts = () => {

    loadProducts(query, state.category_path, page + 1);

    if (ionInfiniteScrollRef.current) {
      ionInfiniteScrollRef.current.complete();
    }
  }

  const handleProductSelection = async (product: any) => {

    setQuery(null);

    cartLoading$.next(true);

    let detail = await productService.view(product);

    if(detail.error) {

      setErrors({ store: detail.error });

      cartLoading$.next(false);

      return false; 
    }

    if (detail.options.length > 0) {

      cartLoading$.next(false);

      setShowModal(true);

      dispatch(setState({
        product_id: detail.product_id,
        options: detail.options,
        recurrings: detail.recurrings
      }));

      return null;
    }

    addProductToCart({ product_id: detail.product_id });
  }

  const addProductToCart = async (options: any) => {

    //hide product grid on selection in mobile

    hideProducts();

    cartLoading$.next(true);

    cartService.addCartProduct(options).then(async (response) => {

      cartLoading$.next(false);

      dispatch(setState({
        barcode: null
      }));

      if(response.error) {
        return setErrors(response.error);
      } else {
        setErrors(null);
      } 

      //update products in cart componenet 

      let data = await cartService.listCartProducts();

      dispatch(loadCart(data));

    }).catch(() => {
      
      cartLoading$.next(false);

      dispatch(setState({
        barcode: null
      }));
    });
  }

  /**
   * open scanner for mobile devices 
   */
  const openScanner = async () => {

    if (!isPlatform('capacitor'))
      return null;

    const data = await BarcodeScanner.scan();

    if (!data) {
      return null;
    }

    handleProductSelection({
      sku: data.text
    });  
  };

  const onProductScan = (sku: any) => {

    if (!sku || sku.length === 0)
      return false;

    handleProductSelection({
      sku: sku
    });  
  }

  const setSearchText = (value: any) => {

    if (value.length > 0) {
      showProducts();
    }

    setQuery(value);

    loadProducts(value, state.category_path);
  }

  const handleCategorySelection = (path: any) => {
    loadProducts(null, path);
  }

  const backToPreviousCategory = () => {
    let paths = state.category_path.split('_');

    paths.pop();

    handleCategorySelection(paths.join('_'));
  }

  /**
   * show products on seachbar focus 
   */
  const showProducts = () => {
    let a = document.getElementById('product-container');
    a?.classList.add('haveFocus');
  }

  /**
   * hide products on mobile on product selection or searchbar cancelled/clear 
   */
  const hideProducts = () => {
    let a = document.getElementById('product-container');
    a?.classList.remove('haveFocus');
  }

  const CartErrors = () => {
    if(!errors)
      return null; 
    
    if(errors.store)
      return errors.store; 

    if(errors.option) {
      let result = '';

      errors.option.forEach(value => {
        result += value + ' ';
      });

      return result;
    } 
  }

  return (
    <div id="product-container">

      <IonAlert
          id="alert-cart-failed"
          isOpen={ !!errors }
          onDidDismiss={() => setErrors(false) }
          header={'Alert'}
          //subHeader={'Error on Login!'}
          message={ CartErrors() }
          buttons={['OK']}
        />

      <IonModal id="product-option-modal" isOpen={showModal} onDidDismiss={(e) => {

        if (e.detail.data && e.detail.data.product_id) {
          addProductToCart(e.detail.data);
        }

        dispatch(setState({
          options: [],
          product_id: null,
          recurrings: [],
        }));

        setShowModal(false);
      }}>
        {
          <ProductOption recurrings={state.recurrings} product_id={state.product_id} options={state.options} />
        }
      </IonModal>

      {
        state.category_path !== 0 ?
          <IonButton color="dark" className="category" onClick={() => { backToPreviousCategory() }}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton> : null
      }

      <IonSearchbar id="inp-scanner" onClick={() => { openScanner() }} placeholder="Scan Products..." onIonChange={e => onProductScan(e.detail.value!) }></IonSearchbar>
     
      <IonSearchbar
        onClick={() => showProducts()}
        onIonCancel={() => hideProducts()}
        onIonClear={() => hideProducts()}
        showCancelButton="focus"
        placeholder="Search Products..."
        //value={ query }
        onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>

      {
        state.categories.map((category: any) => (
          <IonButton color="dark" key={'category-' + category.path} className="category" onClick={() => { handleCategorySelection(category.path) }}>
            <span dangerouslySetInnerHTML={{ __html: category.name }}></span>
          </IonButton>
        ))
      }
       
      <IonGrid className="product-grid">
        <IonRow>

          {

            state.products.map((product: any) => (

              <IonCol sizeLg="4" sizeMd="6" size="12" className="product" key={'product-' + product.product_id} onClick={() => { handleProductSelection(product) }}>

                <IonThumbnail>
                  <IonImg src={product.thumb} />
                </IonThumbnail>

                <h4 dangerouslySetInnerHTML={{ __html: product.name }}></h4>

                <p>{product.model}</p>

                <ProductPrice price={product.price} spacial={product.special} tax={product.tax} />

              </IonCol>
            ))
          }

          <ProductLoader showProductLoader={showProductLoader} />
          <ProductLoader showProductLoader={showProductLoader} />
          <ProductLoader showProductLoader={showProductLoader} />

        </IonRow>
      </IonGrid>

      {
        state.nbPages > page ?
          <IonInfiniteScroll threshold="50px" ref={ionInfiniteScrollRef} onIonInfinite={loadMoreProducts}>
            <IonInfiniteScrollContent
              loadingSpinner="bubbles"
              loadingText="Loading more data...">
            </IonInfiniteScrollContent>
          </IonInfiniteScroll> : null
      }

    </div>
  );
}

function ProductLoader(props) {

  if(props.showProductLoader)
    return (
      <IonCol sizeLg="4" sizeMd="6" size="12" className="product product-loader" key='product-loader-1'>

        <IonThumbnail>
          <IonSkeletonText animated />
        </IonThumbnail>

        <IonSkeletonText animated className="title" />

        <IonSkeletonText animated className="sub-title" />
 
      </IonCol> 
    );

  return null;
}


function ProductPrice(props: any) {
  const price = props.price;
  const special = props.special;
  //const tax = props.tax;

  if (price) {
    return (
      <div className="price">{price}</div>
    )
  }

  return (
    <div className="special-price">
      <div className="price">{special}</div>
      <div className="old">{price}</div>
    </div>
  )
}

