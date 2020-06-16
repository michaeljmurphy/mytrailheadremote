import { LightningElement, api } from 'lwc';

export default class MyTrailheadRemoteResults extends LightningElement {
    @api step;
    @api results;

    selectResultHandler(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('select'));
    }
}
