import { LightningElement, api, track } from 'lwc';
import createLead from '@salesforce/apex/LeadController.createLead';


export default class Lwcchatpack_flow extends LightningElement {
    @api inputParams;
    @track flowname = '';
    @track flowheight = '200';
    @track blReplied = false;
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';
    @track address = '';
    @track company = '';
    @track isSubmitted = false;
    formSubmitted = false;


    connectedCallback() {

        this.conts = this.inputParams.split(':')[2];


        this.lwcName = unescape(this.conts).replace(/&amp;/g, '&');
        console.log('lwcName #######', this.lwcName);
        // let commURL = window.location.pathname.split('/')[1];

        setTimeout(function () {
            this.loadComponent();
        }.bind(this), 500);

    }
    // Handle the custom event dispatched from the dynamically loaded child
    handleChildEvent(event) {
        this.blReplied = true;
        this.dispatchEvent(new CustomEvent('postmessage', { detail: event.detail.value }));
    }

    loadComponent() {
        try {
            const container = this.template.querySelector('.dynamic-component-container');

            if (container) {
                // Clear any previously rendered content
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }


                // Dynamically create the element
                const dynamicComponent = document.createElement('c-' + this.lwcName);
                // Add event listener for the custom event dispatched by the child
                dynamicComponent.addEventListener('onformsubmit', this.handleChildEvent.bind(this));

                container.appendChild(dynamicComponent);
                this.isComponentLoaded = true;
            }
        } catch (error) {
            console.error(`Error loading component: ${error}`);
        }
    }

    // handleInputChange(event) {
    //     const field = event.target.dataset.id;
    //     this[field] = event.target.value;
    // }

    // handleSubmit() {
    //     const allValid = [...this.template.querySelectorAll('lightning-input')]
    //         .reduce((validSoFar, inputCmp) => {
    //             inputCmp.reportValidity();
    //             return validSoFar && inputCmp.checkValidity();
    //         }, true);

    //     if (allValid) {
    //         this.isSubmitted = true;
    //         createLead({ firstName: this.firstName, lastName: this.lastName, email: this.email, phone: this.phone, company: this.company })
    //             .then(result => {
    //                 console.log('Lead created with Id: ', result);
    //                 this.dispatchEvent(new CustomEvent('postmessage', {
    //                     detail: JSON.stringify({
    //                         firstName: this.firstName,
    //                         lastName: this.lastName,
    //                         email: this.email,
    //                         phone: this.phone,
    //                         company: this.company
    //                     })
    //                 }));
    //                 // Optionally handle post-creation logic
    //             })
    //             .catch(error => {
    //                 console.error('Error creating lead: ', error);
    //             });
    //         // Additional processing (e.g., sending data to server) can be added here
    //     } else {
    //         this.isSubmitted = false;
    //     }
    // }

    async handleFormSubmit(event) {
        const formData = event.detail;
        console.log('Form Data:', JSON.stringify(formData));
        try {
            // Call the Apex method to create the lead
            const leadId = await createLead({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                company: 'Acme Corp'  // You can pass a static or dynamic value for the company
            });
            console.log('Lead created with Id:', leadId);

            if (leadId != null) {
                this.dispatchEvent(new CustomEvent('postmessage', {
                    detail: 'lwc:hide:' + 'SUCCESS'
                }));

                this.formSubmitted = true;
            }

        } catch (error) {
            console.error('Error creating lead:', error);
            // Handle error (show error message to the user if needed)
        }
    }

}