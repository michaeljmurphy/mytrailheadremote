import { LightningElement, api } from 'lwc';

export default class MyTrailheadRemoteResults extends LightningElement {
    @api resultTarget;
    displayResults;
    
    selectResultHandler(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('select'), { detail: { "selected" :  event.detail } } );
    }

    get results() {}

    @api
    set results(value) {
        if (value) {
            console.log("results setter: ", JSON.stringify(value));
            this.displayResults = JSON.parse(JSON.stringify(value));
            this.displayResults = this.displayResults.users;
            console.log("displayResults: ", this.displayResults);
        }
    }

    connectedCallback() {
        if(this.resultTarget) { console.log("resultTarget: ", this.resultTarget); }
        if(this.results) { console.log("results callback: ", JSON.stringify(this.results)); }
    }
}
