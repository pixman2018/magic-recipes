import { Component, inject, Signal } from '@angular/core';

// service model
import { MessageService } from '../messageService/message-service';
import { I_MessageState } from '../message_confirem.model';

@Component({
  selector: 'lib-message-dialog',
  imports: [],
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.scss',
})
export class MessageDialog {
  private _messageService = inject(MessageService);
  protected messageData: Signal<I_MessageState | null> = this._messageService.getMessage();

  protected onCloseMessage() {
    this._messageService.closeMessage();
  }
}
