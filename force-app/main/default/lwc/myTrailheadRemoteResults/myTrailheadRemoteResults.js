import { LightningElement, api } from 'lwc';

export default class MyTrailheadRemoteResults extends LightningElement {
    @api resultTarget;
    displayResults;
    
    selectResultHandler(event) {
        event.preventDefault();
        console.log("Selected: ", event.target.name);

        let selectedRecord = this.displayResults.find(i => {
            return i.Id === event.target.name; 
        });

        console.log("Which means: ", selectedRecord);

        this.dispatchEvent(new CustomEvent('select', { detail : { "name" : selectedRecord.Name
                                                                 , "id" : selectedRecord.Id } } ) ) ;
    }

    get results() {}

    @api
    set results(value) {
        if (!value) {
            this.displayResults = [];
            return;
        }

        console.log("results setter: ", JSON.stringify(value));
        this.displayResults = JSON.parse(JSON.stringify(value));
        this.displayResults = this.displayResults.users;

        if(this.resultTarget === "users") {
            this.displayResults.forEach((e, i, a) => {
                this.displayResults[i]["Name"] = this.displayResults[i].FirstName
                    + " "
                    + this.displayResults[i].LastName;
            });
        }

        console.log("displayResults: ", this.displayResults);
    }

    connectedCallback() {
        if(this.resultTarget) {
            console.log("resultTarget: ", this.resultTarget);
            this.displayResults = []; // change on next when target changes
        }
        if(this.results) { console.log("results callback: ", JSON.stringify(this.results)); }
    }
}
