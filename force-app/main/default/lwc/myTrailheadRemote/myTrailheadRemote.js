import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import insertTrailmixAssignments from '@salesforce/apex/MyTrailheadRemoteController.insertTrailmixAssignments';

export default class MyTrailheadRemote extends LightningElement {
    trailmixAssignments;
    searchResults;
    selectedUsers = [];
    selectedTrailmixes = [];
    @track
    selectedUserPills = [];
    @track
    selectedTrailmixPills = [];
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
            
            this.selectedUserPills.push({
                type: "avatar"
                , label: event.detail.name
                , id: event.detail.id
                , src: "/"
                , fallbackIconName: "standard:user"
                , variant: "circle"
                , alternativeText: "User avatar"
            });
            this.selectedUserPills = this.selectedUserPills.filter((v,i,a) => a.findIndex(t => (t.id === v.id)) === i);
            
            console.log("selectedUsers: ", this.selectedUsers);
            console.log("selectedUserPills: ", this.selectedUserPills);
        } else if (this.target === "trailmixes") {
            this.selectedTrailmixes.push({
                "name" : event.detail.name
                , "id" : event.detail.id
            });
            this.selectedTrailmixes = this.selectedTrailmixes.filter((v,i,a) => a.findIndex(t => (t.id === v.id)) === i);

            this.selectedTrailmixPills.push({
                type: "avatar"
                , label: event.detail.name
                , id: event.detail.id
                , src: "/"
                , fallbackIconName: "standard:coaching"
                , variant: "circle"
                , alternativeText: "Trailmix avatar"
            });
            this.selectedTrailmixPills = this.selectedTrailmixPills.filter((v,i,a) => a.findIndex(t => (t.id === v.id)) === i);

            console.log("selectedTrailmixes: ", this.selectedTrailmixes);
        }
    }

    cancelHandler() {
        // err do stuff
        this.target = "users";

        // clean up selectedTrailmixList
        this.selectedTrailmixes = {};
        this.isTrailmixTarget = false;
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
        let _requestBody = {};
        let _trailmixAssignments = [];

        // construct lots of objects to pass to apex
        this.selectedUsers.forEach((e, i, a) => {
            this.selectedTrailmixes.forEach((ek, ik, ak) => {
                _trailmixAssignments.push({
                    "attributes" : {
                        "type" : "trailheadapp__Trailmix_Assignment__c"
                        , "referenceId" : e.id + ":" + ek.id
                    }
                    , "trailheadapp__User__c" : e.id
                    , "trailheadapp__Trailmix__c" : ek.id
                });
            });
        });

        this.trailmixAssignments = _trailmixAssignments;

        _requestBody = {
            "records" : _trailmixAssignments
        };
        
        insertTrailmixAssignments({
            tmixAssignments : JSON.stringify(_requestBody)
        }).then(() => {
            // pass
            const event = new ShowToastEvent({
                "title"  : "Probable Success!"
                , "message" : "Records created"
            });
            this.dispatchEvent(event);
        }).catch((error) => {
            console.log(error.body.message);
            // pass
            const event = new ShowToastEvent({
                "title"  : "Error!"
                , "message" : "{0}"
                , "messageData" : [
                    error.body.message
                ]
            });
            this.dispatchEvent(event);
        });
    }
    
    
    get isNotTrailmixTarget() {
        return !this.isTrailmixTarget;
    }
}
