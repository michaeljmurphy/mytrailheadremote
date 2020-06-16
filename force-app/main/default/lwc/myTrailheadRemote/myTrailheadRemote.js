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


    searchResultSelected(event) {
         const record = event.detail;
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
