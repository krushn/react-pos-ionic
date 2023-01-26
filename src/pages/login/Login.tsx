import React, { useState } from 'react';
import './Login.css';
import { IonContent, IonPage, IonButton, IonInput, IonItem, IonAlert, IonSpinner, IonIcon } from '@ionic/react';
import { eyeOffOutline, eye } from 'ionicons/icons';
import { AuthService } from '../../services/auth-service';


export const Login = ({ track, history }) => {
 
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);
  const [ formErrors, setFormErrors ] = useState(false);
  const [ loading, setShowLoading] = useState(false);

  const authService = new AuthService(); 
   
  const handleSubmit = async () => {

    let params = {
      userName: username,
      password: password
    }

    setShowLoading(true);

    let data = await authService.signIn(params);
    
    setShowLoading(false);

    if (data.operation === 'success') {

      authService.setToken(data);
      
      /*let cartData = await cartService.listCartProducts();
        
      let productData = await productService.list({ page : 1 }); 
  
      dispatch(loggedIn({ ...cartData, ...productData, ...data }));
      */

      history.push('/home');

    } else {

      setFormErrors(data.message);

    }
  }

  return (
    <IonPage>
      <IonContent>

        <IonAlert
          id="alert-login-failed"
          isOpen={ !!formErrors }
          onDidDismiss={() => setFormErrors(false) }
          header={'Alert'}
          //subHeader={'Error on Login!'}
          message={'Invalid username or password.'}
          buttons={['OK']}
        />

        <div className="login-wrapper">

          <div className="brand">
            Login
          </div>

          <IonItem>
            <IonInput placeholder="Enter Username" onIonChange={e => setUsername(e.detail.value!)}></IonInput>
          </IonItem>

          <IonItem>
            <IonInput type={ showPassword ? 'text' : 'password'} placeholder="Enter Password" onIonChange={e => setPassword(e.detail.value!)}>
            </IonInput>
            <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword) }>
              <IonIcon slot="icon-only" icon={ showPassword ? eyeOffOutline : eye} />
            </IonButton>
          </IonItem>

          <IonButton expand="full" onClick={() => { handleSubmit() }}
            disabled={ loading || !username || !password}>
            {
              loading ? <IonSpinner></IonSpinner> : 'Submit'
            }
          </IonButton>

        </div>

      </IonContent>
    </IonPage>
  );
}

export default Login;
