import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessedStatus, UpdateStatusDialogComponent } from "../update-status-dialog/update-status-dialog.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, UpdateStatusDialogComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private http = inject(HttpClient);
  private baseUrl = inject<string>('BASE_URL' as any);
  notifications = signal<NotificationModel[]>([]);
  public file = signal<string>('');
  showDialog = signal(false);
  fileIdFromNotification = computed(() => this.notifications().map(n => n.fileId));
  applicationName = computed(() => this.notifications().map(n => n.applicationName));
  version = computed(() => this.notifications().map(n => n.fileVersion || "2022-02-16T11:12:56.3052287Z"));
  public askJson: boolean = false;
  public isJson: boolean = false;
  public key: string = '';

  constructor() {
    interval(2000)
      .pipe(
        switchMap(() =>
          this.http.get<NotificationModel>(this.baseUrl + 'notifications'),
        ),
        catchError((error) => (this.file = error)),
      )
      .subscribe((result) => (this.notifications.set(result as NotificationModel[])));
    this.http
      .get<KeyModel>(this.baseUrl + 'key')
      .subscribe((result) => (this.key = result.key));
  }

  public GetFile(notification: NotificationModel) {
    return this.http
      .get(notification.dataUrl, {
        responseType: 'text',
        headers: {
          'Ocp-Apim-Subscription-Key': this.key,
          Accept: this.askJson ? 'application/json' : 'application/xml',
          Authorization: 'Bearer ' + notification.token,
        },
      })
      .subscribe(
        (result) =>
        (this.file.set(this.IsJson(result)
          ? JSON.parse(result)
          : result.toString())
        ));
  }
  public saveKey() {
    this.http.post(this.baseUrl + 'key', { key: this.key }).subscribe(() => { });
  }
  public notificationIdentifier(_index: number, item: NotificationModel) {
    return item.dataUrl;
  }
  public clearNotifications() {
    this.http.delete(this.baseUrl + 'notifications').subscribe(() => { });
  }
  private IsJson(value: string): boolean {
    try {
      JSON.parse(value);
      this.isJson = true;
      return true;
    } catch {
      this.isJson = false;
      return false;
    }
  }
  public openNotificationDialog(): void {
    this.showDialog.set(true);
  }

  public closeNotificationDialog(): void {
    this.showDialog.set(false);
  }

  public handleDialogSubmit(event: { processedStatus: ProcessedStatus, comments: string }, notification: NotificationModel): void {
    // Handle the submit action here

    const apiUrl = notification.dataUrl.split('/applications')[0];
    const statusEndpoint = `files/${this.applicationName()}/${this.fileIdFromNotification()}/status?version=${this.version()}`;
    const formData = { processedStatus: event.processedStatus, comments: event.comments };
    console.log('Posting to:', statusEndpoint, 'with:', formData);
    console.log('Posting to:', apiUrl + statusEndpoint, 'with:', formData);
    this.http.post(apiUrl + statusEndpoint, formData).subscribe(() => { });
    this.closeNotificationDialog();
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
