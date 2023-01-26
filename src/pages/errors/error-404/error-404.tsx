import React from 'react';
import './error-404.css';
import { IonButton } from '@ionic/react';
 
const Error404: React.FC = (props: any) => {
  return (
    <div className="container">
      <strong>Error 404</strong>

      <p>Page not found</p>

      <IonButton onClick={ () => { props.history.push('/') } }>
          Home
      </IonButton>
    </div>
  );
};

export default Error404;
