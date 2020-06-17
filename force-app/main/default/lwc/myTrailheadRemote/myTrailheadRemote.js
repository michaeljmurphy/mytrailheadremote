import { LightningElement, api } from 'lwc';

export default class MyTrailheadRemote extends LightningElement {
    searchResults;
    selectedUsers;
    selectedTrailmixes;
    isTrailmixTarget = false;
    target;

    connectedCallback() {
        this.target = 'users';
    }


    searchResultHandler(event) {
        console.log('parent ', JSON.stringify(event.detail.users));
        this.searchResults = event.detail;
    }

    selectResultHandler(event) {
        console.log('parent ', event.detail);
    }

    cancelHandler() {
        // err do stuff
    }

    previousHandler() {
        this.target = 'users';

        // clean up selectedTrailmixList
        this.selectedTrailmixes = {};
        this.isTrailmixTarget = false;
    }

    nextHandler() {
        this.target = 'trailmixes'; // next step
        this.isTrailmixTarget = true;
    }
}
