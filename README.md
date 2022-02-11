# demo-erp-app
Test application to interact with Brink ERP Integration system.

This app simulates an ERP system with an endpoint to receive notifications. When the app receives a notifications, it is displayed with a button that allows the user to send a request to the Brink ERP Integration API.

Notification Example:
```json
{ 
  "fileId": "74dedef3-6f2b-4a3...",
  "fileVersion": "2022-02-08T08:51:45.9211020Z",
  "applicationName": "calculerenvoorbouw",
  "dataUrl": "https://dataservice.ibis.nl/public/applications/calculerenvoorbouw/files/1e45-65gt-5656?version=2022-02-08T08:51:45.9211020Z", 
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpX...",
  "customProperties": {
	"key": "value"
  }
}
```

The most important fields are "dataUrl" and "token".
The app sends a HTTP request to the url specified by “dataUrl” with the following HTTPHeaders:

![image](https://user-images.githubusercontent.com/30176581/153437030-6b6f2a9a-f437-4db0-965d-f39f568188d3.png)

* Accept: Optional. ERP API supports “application/json” en “application/xml”
* Authorization: A bearer token with the value specified in the "token" field in the notification.
* Ocp-Apim-Subscription-Key: De API key needed to access the ERP API. This key is provided by Brink.



 
