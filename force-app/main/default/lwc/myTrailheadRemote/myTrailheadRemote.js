import { LightningElement, api } from 'lwc';

export default class MyTrailheadRemote extends LightningElement {
    searchResults;
    selectedUsers = [];
    selectedTrailmixes = [];
    isTrailmixTarget = false;
    target;

    connectedCallback() {
        this.target = "users";
    }

    searchResultHandler(event) {
        console.log('parent search result: ', JSON.stringify(event.detail.users));
        this.searchResults = event.detail;
    }

    selectResultHandler(event) {
        console.log('parent select result: ', JSON.stringify(event.detail));
        if(this.target === "users") {
            this.selectedUsers.push({
                "name" : event.detail.name
                , "id" : event.detail.id
            });

            this.selectedUsers = this.selectedUsers.filter((v,i,a) => a.findIndex(t => (t.id === v.id)) === i);
            
            console.log("selectedUsers: ", this.selectedUsers);
        } else if (this.target === "trailmixes") {
            this.selectedTrailmixes.push({
                "name" : event.detail.name
                , "id" : event.detail.id
            });
            this.selectedTrailmixes = this.selectedTrailmixes.filter((v,i,a) => a.findIndex(t => (t.id === v.id)) === i);

            console.log("selectedTrailmixes: ", this.selectedTrailmixes);
        }
    }

    cancelHandler() {
        // err do stuff
    }

    previousHandler() {
        this.target = "users";

        // clean up selectedTrailmixList
        this.selectedTrailmixes = {};
        this.isTrailmixTarget = false;
    }

    nextHandler() {
        this.target = "trailmixes"; // next step
        this.isTrailmixTarget = true;
    }

    submitHandler() {
        
    }

    get isNotTrailmixTarget() {
        return !this.isTrailmixTarget;
    }
}
