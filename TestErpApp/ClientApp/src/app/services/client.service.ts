import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationModel } from '../models/notification';
import { KeyModel } from '../models/key';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  httpClient = inject(HttpClient);
  private baseUrl = inject<string>('BASE_URL' as any);

  public GetFile(
    notification: NotificationModel,
    subscriptionKey: string,
    jsonOrXml: boolean,
  ) {
    return this.httpClient.get(notification.dataUrl, {
      responseType: 'text',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        Accept: jsonOrXml ? 'application/json' : 'application/xml',
        Authorization: 'Bearer ' + notification.token,
      },
    });
  }

  public getNotifications() {
    return this.httpClient.get<NotificationModel[]>(
      this.baseUrl + 'notifications',
    );
  }

  public getKey() {
    return this.httpClient.get<KeyModel>(this.baseUrl + 'key');
  }

  public saveKey(key: string) {
    return this.httpClient.post(this.baseUrl + 'key', { key: key });
  }

  public clearNotifications() {
    return this.httpClient.delete(this.baseUrl + 'notifications');
  }

  public updateStatus(
    applicationName: string,
    fileId: string,
    version: string,
    notification: NotificationModel,
    processedStatus: string,
    comments: string,
    subscriptionKey: string,
    jsonOrXml: boolean,
  ) {
    const apiUrl = notification.dataUrl.split('/applications')[0] + '/';
    const statusEndpoint = `applications/${applicationName}/files/${fileId}/status?version=${version}`;
    const formData = { processedStatus: processedStatus, comments };

    return this.httpClient
      .post(apiUrl + statusEndpoint, formData, {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          Accept: jsonOrXml ? 'application/json' : 'application/xml',
          Authorization: 'Bearer ' + notification.token,
        },
      })
      .subscribe(() => {});
  }
}
