import React from 'react';
import './error-400.css';
import { IonButton } from '@ionic/react';
 
const Error400: React.FC = (props: any) => {
  return (
    <div className="container">
      <strong>Error 400</strong>

      <p>Bad request exception</p>

      <IonButton onClick={ () => { props.history.push('/') } }>
          Home
      </IonButton>
    </div>
  );
};

export default Error400;
