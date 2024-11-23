import { LightningElement, api, track } from 'lwc';
import FLOW_BASE_URL from '@salesforce/label/c.Flow_Base_URL';

export default class Lwcchatpack_flow extends LightningElement {
    @api inputParams;
    @track flowname = '';
    @track flowheight = '200';
    @track blReplied = false;

    handleFinish(event) {
        if (event.data && event.data.type === 'flow.finished' && !this.blReplied) {
            //alert('data:' + event.data.message);
            this.blReplied = true;
            this.dispatchEvent(new CustomEvent('postmessage', { detail: event.data.message }));
        }
    }

    connectedCallback() {
        this.conts = this.inputParams.split(':')[2];
        if (this.inputParams.split(':').length > 3) {
            this.flowheight = this.inputParams.split(':')[3];
        }

        this.flowurl = unescape(this.conts).replace(/&amp;/g, '&');
        console.log('flow url#######', this.flowurl);
        // let commURL = window.location.pathname.split('/')[1];

        // if (commURL === 's') {
        //     commURL = '';
        // } else {
        //     commURL = '/' + commURL;
        // }
        // console.log('comm URL#######', commURL);
        this.flowname = `${FLOW_BASE_URL}${this.flowurl}`;

        console.log('flow name#######', this.flowname);

        //Try to handle a post from the flow finishing
        window.addEventListener('message', this.handleFinish.bind(this));

    }

    disconnectedCallback() {
        window.removeEventListener('message', this.handleFinish.bind(this));
    }
}