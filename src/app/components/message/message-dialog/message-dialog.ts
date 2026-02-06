import { Component, inject, input } from '@angular/core';
import { I_MessageState } from '../../../models/message_confirem.model';
import { JsonPipe } from '@angular/common';
import { MessageService } from '../messageService/message-service';

@Component({
  selector: 'lib-message-dialog',
  imports: [JsonPipe],
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.scss',
})
export class MessageDialog {
  private _messageService = inject(MessageService);
  public messageData = input.required<I_MessageState | null>();

  protected onCloseMessage() {
    this._messageService.closeMessage();
  }
}
