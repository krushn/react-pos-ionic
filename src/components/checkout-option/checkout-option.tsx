import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonListHeader, IonItem, IonLabel, IonInput, IonContent, IonFooter, IonButton, IonPage, IonIcon, IonTitle } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';


export function CheckoutOption(props: any) {

    let customerDetail: any = {
        'customer_group_id': null,
        'payment_method': 'Cash on Counter',
        'payment_code': 'cash_on_counter',
        'shipping_zone_id': null,
        'shipping_country_id': null,
        'shipping_address_format': null,
        'shipping_custom_field': [],
        'shipping_method': null,
        'shipping_code': null
    };

    function updateDetail(key: string, value: string) {
        customerDetail[key] = value;
    }

    function closeModal(props: any = null) {
        let a = document.getElementById('checkout-modal') as HTMLIonModalElement;
        a.dismiss(props);
    }

    function handleSubmit(props: any) {
        closeModal(customerDetail);
    }

    return (

        <IonPage className="checkout-wrapper">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Order Detail
                </IonTitle>
                    <IonButtons slot="start">
                        <IonButton onClick={() => closeModal()}>
                            <IonIcon icon={arrowBackOutline} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonItem>
                    <IonLabel position="floating">First name</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('firstname', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Last name</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('lastname', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('email', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Telephone</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('telephone', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Order Specific Instruction</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('comment', e.detail.value)
                    }} />
                </IonItem>

                <IonListHeader>
                    Shipping Detail
            </IonListHeader>

                <IonItem>
                    <IonLabel position="floating">First name</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('shipping_firstname', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Last name</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('shipping_lastname', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Courier Company</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('shipping_company', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Landmark</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('shipping_address_1', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Area</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('shipping_address_2', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">City</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('shipping_city', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Zip code</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('shipping_postcode', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Shipping Zone</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('shipping_zone', e.detail.value)
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Shipping Country</IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateDetail('shipping_country', e.detail.value)
                    }} />
                </IonItem>

            </IonContent>
            <IonFooter>
                <IonButton expand="full" onClick={() => { handleSubmit(props) }}>
                    Confirm Order
            </IonButton>
            </IonFooter>
        </IonPage> 
    );
}
