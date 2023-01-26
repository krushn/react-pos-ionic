import React from 'react';
import './error-500.css';
import { IonButton } from '@ionic/react';
 
const Error500: React.FC = (props: any) => {
  return (
    <div className="container">
      <strong>Error 500</strong>

      <p>Server error</p>

      <IonButton onClick={ () => { props.history.push('/') } }>
          Home
      </IonButton>
    </div>
  );
};

export default Error500;
