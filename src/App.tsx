
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './global.scss';

/* Theme variables */
import './theme/variables.scss';

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
//services
import { AuthService } from './services/auth-service';
//pages
import Home from './pages/Home';
import Login from './pages/login/Login';
import Error400 from './pages/errors/error-400/error-400';
import Error500 from './pages/errors/error-500/error-500';
import Error404 from './pages/errors/error-404/error-404';
import Offline from './pages/errors/offline/offline';

import { AppContextProvider } from './State';


const authService = new AuthService();

authService.loadToken();

const App: React.FC = (props: any) => { 
  
  return (
    <AppContextProvider>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet id="ionReactRouter">
            <Route path="/error-400" component={Error400} exact={true} />
            <Route path="/error-404" component={Error404} exact={true} />
            <Route path="/error-500" component={Error500} exact={true} />
            <Route path="/offline" component={Offline} exact={true} />
            <Route path="/home" component={Home} exact={true} />
            <Route path="/login" component={Login} exact={true} />
            <Route exact path="/" render={
              () => {

                if (authService.user && authService.user.length > 0) {
                  
                  return <Redirect to="/home" />
                } else {
                  return <Redirect to="/login" />;
                }
              }
            } />
          </IonRouterOutlet>
        </IonReactRouter>

        <div id="alert-wrapper"></div>
      </IonApp>
    </AppContextProvider>
  );
}

export default App;
