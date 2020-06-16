import { LightningElement, api, wire} from 'lwc';
import getUsers from '@salesforce/apex/MyTrailheadRemoteController.getUsers';
import getTrailmixes from '@salesforce/apex/MyTrailheadRemoteController.getTrailmixes';

export default class MyTrailheadRemoteSearch extends LightningElement {
    @api searchTarget;
    userSearchString;
    trailmixSearchString;
    results;
    error;

    @wire(getUsers, { searchString: '$userSearchString' })
    wiredUsers({ error, data }) {
        if(error) {
            this.error = 'Unknown error';
            if(Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
            this.results = undefined;
            console.log("error: " + this.error);
        } else if (data) {
            this.results = data;
            console.log(data);
        }
    }

    @wire(getTrailmixes, { searchString: '$trailmixSearchString' })
    wiredTrailmixes({ error, data }) {
        if(error) {
            this.error = 'Unknown error';
            if(Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
            this.results = undefined;
            console.log("error: " + this.error);
        } else if (data) {
            this.results = data;
            console.log(data);
        }
    }
    
    searchHandler(event) {
        const isEnterKey = event.keyCode === 13;
        console.log('searchHandler');
        console.log('keyCode: ' + event.keyCode);
        if (isEnterKey) {
            console.log('isEnterKey');
            console.log('searchTarget: ' + this.searchTarget);
            
            if(this.searchTarget === 'users') {
                this.userSearchString = event.target.value;
                console.log('userSearchString: ' + event.target.value);
            } else if (this.searchTarget === 'trailmixes') {
                this.trailmixSearchString = event.target.value;
                console.log('trailmixSearchString: ' + event.target.value);
            }
        }
    }    
}
