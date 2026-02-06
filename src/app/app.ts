import { Component, inject, Signal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// component
import { HeaderComponent } from './components/layout/header-component/header-component';
import { ConfirmDialog } from './components/message/confirm-dialog/confirm-dialog';
import { MessageDialog } from './components/message/message-dialog/message-dialog';

// services and model
import { MessageService } from './components/message/messageService/message-service';
import { I_MessageState } from './components/message/message_confirem.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MessageDialog, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private _messageService = inject(MessageService);
  protected message: Signal<I_MessageState | null> = this._messageService.getMessage();
}
