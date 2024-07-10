import { Component, computed, EventEmitter, Input, model, output, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcessedStatus } from '../models/processedstatus';



@Component({
  selector: 'app-update-status-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './update-status-dialog.component.html',
  styleUrl: './update-status-dialog.component.css'
})
export class UpdateStatusDialogComponent {
  close = output();
  submit = output<{ processedStatus: ProcessedStatus, comments: string }>();
  remainingCharacters = computed(() => 250 - this.comments().length);

  processedStatusOptions = Object.values(ProcessedStatus);
  processedStatus = model<ProcessedStatus>(ProcessedStatus.Succeeded);
  comments = model('');

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit({ processedStatus: this.processedStatus(), comments: this.comments() });
  }
}
