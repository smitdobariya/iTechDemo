import { LightningElement, track } from 'lwc';

export default class LeadForm extends LightningElement {
    firstName;
    lastName;
    email;
    phone;

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    handleSubmit() {
        // Dispatch a custom event with form data when submit is clicked
        const submitEvent = new CustomEvent('submitform', {
            detail: {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                phone: this.phone
            }
        });
        this.dispatchEvent(submitEvent);
    }
}
