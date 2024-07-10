import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateStatusDialogComponent } from "../update-status-dialog/update-status-dialog.component";
import { NotificationModel } from '../models/notification';
import { ClientService } from '../services/client.service';
import { ProcessedStatus } from '../models/processedstatus';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, UpdateStatusDialogComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private clientService = inject(ClientService);

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
          this.clientService.getNotifications()
        ),
        catchError((error) => (this.file = error)),
      )
      .subscribe((result) => (this.notifications.set(result as NotificationModel[])));
    this.clientService.getKey().subscribe((result) => (this.key = result.key));
  }

  public GetFile(notification: NotificationModel) {

    return this.clientService.GetFile(notification, this.key, this.askJson)
      .subscribe(
        (result) =>
        (this.file.set(this.IsJson(result)
          ? JSON.parse(result)
          : result.toString())
        ));
  }
  public saveKey() {
    this.clientService.saveKey(this.key).subscribe(() => { });
  }
  public notificationIdentifier(_index: number, item: NotificationModel) {
    return item.dataUrl;
  }
  public clearNotifications() {
    this.clientService.clearNotifications().subscribe(() => { });
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
    this.clientService.updateStatus(this.applicationName()[0], this.fileIdFromNotification()[0], this.version()[0], notification, event.processedStatus, event.comments, this.key, this.askJson);
    this.closeNotificationDialog();
  }

}




