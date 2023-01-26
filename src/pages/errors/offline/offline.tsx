import React from 'react';
import './offline.css';
import { IonButton } from '@ionic/react';
 
const Offline: React.FC = (props: any) => {
  return (
    <div className="container">
      <strong>Offline</strong>

      <p>Internet disconnected</p>

      <IonButton onClick={ () => { props.history.push('/') } }>
          Home
      </IonButton>
    </div>
  );
};

export default Offline;
