/* myTrailheadRemoteController
 * 
 * Use this to assign trailmixes to users in another org
 *
 * author: michaelmurphy
 * @todo: reduce duplication
 * */ 


public with sharing class MyTrailheadRemoteController {
    public MyTrailheadRemoteController() { }

    // @todo: custom setting
    public static String API = 'v45.0';

    public HttpResponse calloutToMyThOrg(String uri, String verb, String body) {
        HttpRequest req = new HttpRequest();
        String NAMEDCREDENTIAL = 'callout://mythorg';
        req.setEndpoint(NAMEDCREDENTIAL + uri);
        req.setMethod(verb);

        if(verb == 'POST' && !String.isEmpty(body)) {
            req.setHeader('Content-Type', 'application/json');
            req.setBody(body);
        }
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        return res;
    }

    @AuraEnabled(cacheable = true)
    public static List<User> getUsers(String searchString) {
        MyTrailheadRemoteController c = new MyTrailheadRemoteController();

        // @todo: custom label
        String GET_USERS_FAILURE = 'There was a problem getting the users!';

        String QUERY = String.escapeSingleQuotes(searchString);
        String URI = '/services/data/'
            + API
            + '/parameterizedSearch';
        
        // @todo: serialise this properly
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject(); 
        gen.writeStringField('q', QUERY);
        gen.writeFieldName('sobjects');
        gen.writeStartArray(); // start of sobject array
        gen.writeStartObject(); // start of sobject
        gen.writeStringField('name', 'User');
        gen.writeFieldName('fields');
        gen.writeStartArray(); // start of field array

        gen.writeString('Id');
        gen.writeString('FirstName'); // @todo: parameterise / data drive this
        gen.writeString('LastName');

        gen.writeEndArray(); // end of field array
        gen.writeEndObject(); // end of sobject
        gen.writeEndArray(); // end of sobject array
        gen.writeEndObject(); // end of json


        HttpResponse res = c.calloutToMyThOrg('' + URI + QUERY, 'POST', gen.getAsString());

        try {
            return (List<User>) System.JSON.deserialize(res.getBody(), List<User>.class);
        } catch (Exception e) {
            throw new MyTrailheadRemoteController.MyTrailheadRemoteControllerException(GET_USERS_FAILURE);
        }
    }

    @AuraEnabled(cacheable = true)
    public static String getAllTrailmixes() {
        MyTrailheadRemoteController c = new MyTrailheadRemoteController();

        // @todo: custom label
        String GET_TRAILMIX_FAILURE = 'There was a problem getting the trailmixes!';

        String QUERY = 'select id'
            + ', name'
            + ', trailheadapp__description__c'
            + ', isLocked'
            + ', trailheadapp__archived__c'
            + ', trailheadapp__url__c'
            + ' from trailheadapp__trailmix__c'
            + ' where isLocked = false and trailheadapp__archived__c = false';
        String URI = '/services/data/'
            + API
            + '/query/?q=';
        HttpResponse res = c.calloutToMyThOrg('' + URI + QUERY, 'GET', null);

        try {
            return res.getBody(); // I don't want to create a wrapper object to deserialise into
        } catch (Exception e) {
            throw new MyTrailheadRemoteController.MyTrailheadRemoteControllerException(GET_TRAILMIX_FAILURE);
        }
    }

    @AuraEnabled(cacheable = true)
    public static String getAllTrailmixAssignments() {
        MyTrailheadRemoteController c = new MyTrailheadRemoteController();

        // @todo: custom label
        String GET_TMIX_ASSIGNMENT_FAILURE = 'There was a problem getting the trailmix assignments!';

        String QUERY = 'select id'
            + ', trailheadapp__user__c'
            + ', trailheadapp__user__r.FirstName'
            + ', trailheadapp__user__r.LastName'
            + ', trailheadapp__trailmix__c'
            + ', trailheadapp__trailmix__r.Name'
            + ' from trailheadapp__trailmix_assignment__c'
            + ' where trailheadapp__trailmix__r.isLocked = false'
            + ' and trailheadapp__trailmix__r.trailheadapp__archived__c = false';
            
        String URI = '/services/data/'
            + API
            + '/query/?q=';
        HttpResponse res = c.calloutToMyThOrg('' + URI + QUERY, 'GET', null);

        try {
            return res.getBody(); // I don't want to create a wrapper object to deserialise into
        } catch (Exception e) {
            throw new MyTrailheadRemoteController.MyTrailheadRemoteControllerException(GET_TMIX_ASSIGNMENT_FAILURE);
        }
    }

    @AuraEnabled(cacheable = true)
    public static Boolean insertTrailmixAssignment(String tmixAssignments) {
        MyTrailheadRemoteController c = new MyTrailheadRemoteController();
        String URI = '/services/data/'
            + API
            + 'sobjects/trailheadapp__Trailmix_Assignment__c';

        HttpResponse res = c.calloutToMyThOrg(URI, 'POST', tmixAssignments);

        return String.valueOf(res.getStatusCode()).startsWith('2');
    }

    public class MyTrailheadRemoteControllerException extends Exception {}
}
