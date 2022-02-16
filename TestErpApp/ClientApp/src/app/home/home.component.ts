import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent {
  public notifications: any;
  public file: any;
  public askJson: boolean = false;
  public isJson: boolean = false;
  public key: string = '';

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    interval(2000).pipe(switchMap(() => this.http.get<NotificationModel>(this.baseUrl + 'notifications')), catchError((error) => this.file = error)).subscribe(result => this.notifications = result);
    this.http.get<KeyModel>(this.baseUrl + 'key').subscribe(result => this.key = result.key);
  }

  public GetFile(notification: NotificationModel) {
    return this.http.get(notification.dataUrl, { responseType: 'text', headers: { 'Ocp-Apim-Subscription-Key': this.key, 'Accept': this.askJson ? 'application/json' : 'application/xml', 'Authorization': 'Bearer ' + notification.token } })
      .subscribe(result => this.file = this.IsJson(result) ? JSON.parse(result) : result.toString());
  }
  public saveKey() {
    this.http.post(this.baseUrl + 'key', { key: this.key }).subscribe(() => { });
  }

  public notificationIdentifier(_index: number, item: NotificationModel) {
    return item.dataUrl;
  }

  private IsJson(value: string) : boolean{
    try {
      JSON.parse(value);
      this.isJson = true;
      return true;
    }
    catch {
      this.isJson = false;
      return false;
    }
  }
}

interface NotificationModel {
  companyId: string;
  fileId: string;
  fileVersion: string;
  applicationName: string;
  dataUrl: string;
  entityStatus: string;
  token: string;
}

interface KeyModel {
  key: string;
}
