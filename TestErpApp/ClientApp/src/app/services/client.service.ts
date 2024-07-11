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
    version: string,
    notificationDataUrl: string,
    statusBody: { processedStatus: string, comments: string },
    subscriptionKey: string,
    jsonOrXml: boolean,
    bearerToken: string,
  ) {
    const apiUrl = notificationDataUrl.split('?version')[0];
    const statusEndpoint = `/status?version=${version}`;

    const endpoint = apiUrl + statusEndpoint;

    return this.httpClient
      .post(endpoint, statusBody, {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          Accept: jsonOrXml ? 'application/json' : 'application/xml',
          Authorization: 'Bearer ' + bearerToken,
        },
      })
      .subscribe(() => { });
  }
}
