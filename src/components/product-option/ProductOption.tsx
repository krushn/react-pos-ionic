import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonRadioGroup, IonDatetime, IonList, IonThumbnail, IonRadio, IonListHeader, IonItem, IonLabel, IonInput, IonTextarea, IonSelectOption, IonSelect, IonContent, IonFooter, IonButton, IonPage, IonIcon, IonTitle } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';


export function ProductOption(props: any) {

    let productOptions: any = {};
    let recurring_id: any = 0;

    let optionHavingErrors: any; 

    function updateOptionState(product_option_id: any, value: any) {
        productOptions[product_option_id] = value;
    }

    function RadioCheckboxOption(props: { option: any, errors: any }) {

        return (
            <div>
                <IonList>
                    <IonRadioGroup
                        onIonChange={(e: any) => {
                            updateOptionState(props.option.product_option_id, e.detail.value)
                        }}>
                        <IonListHeader>
                            <IonLabel>
                                <span dangerouslySetInnerHTML={{ __html: props.option.name }}></span>
                                {
                                    props.option.required? <span className="required">*</span>: null
                                }
                            </IonLabel>
                        </IonListHeader>

                        {
                            props.option.product_option_value.map((option_value: any) => (

                                <IonItem key={ 'product_option_value' + option_value.product_option_value_id }>
                                    {
                                        option_value.image ?
                                            <IonThumbnail>
                                                <img alt={option_value.name} src={option_value.image} className="img-thumbnail" />
                                            </IonThumbnail> : null
                                    }

                                    <IonLabel>{option_value.name}</IonLabel>
                                    <IonRadio value={option_value.product_option_value_id} />
                                </IonItem>
                            ))
                        }
                    </IonRadioGroup>
                </IonList>
                <PropductOptionError errors={props.errors} />
            </div>
        );
    }

    function DateOption(props: any) {

        let pickerFormat;
        
        switch (props.option.type) {
           
            case 'date':
                pickerFormat = 'MM/DD/YYYY';
                break;
            case 'time':
                pickerFormat = 'HH:mm';
                break;
            case 'datetime':
                pickerFormat = 'YYYY-MM-DDTHH:mm';
                break;
            default:
                break;
        }
        return (
            <div>
                <IonItem>
                    <IonLabel position="floating">
                        <span dangerouslySetInnerHTML={{ __html: props.option.name }}></span>
                        {
                            props.option.required? <span className="required">*</span>: null
                        }
                    </IonLabel>
                    <IonDatetime displayFormat={pickerFormat} pickerFormat={pickerFormat} onIonChange={(e: any) => {
                        updateOptionState(props.option.product_option_id, e.detail.value)
                    }} />
                </IonItem>
                <PropductOptionError errors={props.errors} />
            </div>
        )
    }

    function TextareaOption(props: any) {

        return (
            <div>
                <IonItem>
                    <IonLabel position="floating">
                        <span dangerouslySetInnerHTML={{ __html: props.option.name }}></span>
                        {
                            props.option.required? <span className="required">*</span>: null
                        }
                    </IonLabel>
                    <IonTextarea onIonChange={(e: any) => {
                        updateOptionState(props.option.product_option_id, e.detail.value)
                    }} />
                </IonItem>
                <PropductOptionError errors={props.errors} />
            </div>
        )
    }

    function TextOption(props: any) {

        return (
            <div>
                <IonItem>
                    <IonLabel position="floating">
                        <span dangerouslySetInnerHTML={{ __html: props.option.name }}></span>
                        {
                            props.option.required? <span className="required">*</span>: null
                        }
                    </IonLabel>
                    <IonInput onIonChange={(e: any) => {
                        updateOptionState(props.option.product_option_id, e.detail.value)
                    }} />
                </IonItem>
                <PropductOptionError errors={props.errors} />
            </div>
        )
    }

    function SelectOption(props: any) {

        if (props.option.type !== 'select')
            return null;

        return (
            <div>
                <IonItem>
                    <IonLabel position="floating">
                        <span dangerouslySetInnerHTML={{ __html: props.option.name }}></span>
                        {
                            props.option.required? <span className="required">*</span>: null
                        }
                    </IonLabel>
                    <IonSelect onIonChange={(e: any) => {
                        updateOptionState(props.option.product_option_id, e.detail.value)
                    }}>

                        {
                            props.option.product_option_value.map((option_value: any) => (
                                <IonSelectOption key={ 'product_option_value' + option_value.product_option_value_id } value={option_value.product_option_value_id}>
                                    {option_value.name}

                                    {
                                        option_value.price ? <span>
                                            ({option_value.price_prefix} {option_value.price})
                                        </span> : null
                                    }
                                </IonSelectOption>
                            ))
                        }

                    </IonSelect>
                </IonItem>

                <PropductOptionError errors={props.errors} />
            </div>
        )
    }

    function ProductRecurring(props: any) {

        if (!props.recurrings || props.recurrings.length === 0)
            return null;

        return (

            <IonItem>
                <IonLabel position="floating">{props.product.text_payment_recurring}</IonLabel>
                <IonSelect onIonChange={(e: any) => {
                    recurring_id = e.detail.value;
                }}>
                    {
                        props.recurrings.map((recurring: any) => (
                            <IonSelectOption key={ 'product_option_value' + recurring.recurring_id } value={recurring.recurring_id}>
                                {recurring.name}
                            </IonSelectOption>
                        ))
                    }
                </IonSelect>
            </IonItem>
        )
    }

    function PropductOptionError(props: any) {

        if (!props.errors)
            return null;

        return (
            <p className="option-error">
                {props.errors}
            </p>
        );
    }

    function handleProductSubmit(props: any) {

        optionHavingErrors = false; 

        for (let option of props.options) {
            if (
                option.required && (
                    !productOptions[option.product_option_id] ||
                    productOptions[option.product_option_id].length === 0
                )
            ) {
                optionHavingErrors = option;
                break;
            }
        }

        if (optionHavingErrors) {
            alert(optionHavingErrors.name + ' is a required field');
            return false;
        }

        closeModal({
            product_id: props.product_id,
            options: productOptions,
            recurring_id: recurring_id
        });
    }

    function ProductOptionRenderSelector(props: any) {

        if (props.option.type === 'select')
            return (
                <SelectOption option={props.option} errors={props.errors} />
            );

        else if (props.option.type === 'text')
            return (
                <TextOption option={props.option} errors={props.errors} />
            );

        else if (props.option.type === 'textarea')
            return (
                <TextareaOption option={props.option} errors={props.errors} />
            );

        else if (props.option.type === 'radio' || props.option.type === 'checkbox')
            return (
                <RadioCheckboxOption option={props.option} errors={props.errors} />
            );

        else if (props.option.type === 'date' || props.option.type === 'datetime' || props.option.type === 'time')
            return (
                <DateOption option={props.option} errors={props.errors} />
            );

        else return null;
    }

    function closeModal(props: any = null) {
        let a = document.getElementById('product-option-modal') as HTMLIonModalElement;
        a.dismiss(props);
    } 

    return (
        <div className="options-wrapper">
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            Product Options
                        </IonTitle>
                        <IonButtons slot="start">
                            <IonButton onClick={() => closeModal()}>
                                <IonIcon icon={arrowBackOutline} slot="icon-only"></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>

                    {
                        props.options.map((option: any) => (
                            <ProductOptionRenderSelector key={ 'product_option_error' + option.option_id } errors={props?.errors?.[option.product_option_id]} option={option} />
                        ))
                    }

                    <ProductRecurring product={props.product} />

                </IonContent>
                <IonFooter>
                    <IonButton expand="full" onClick={() => { handleProductSubmit(props) }}>
                        Add To Cart
                    </IonButton>
                </IonFooter>
            </IonPage>
        </div>
    );
};
