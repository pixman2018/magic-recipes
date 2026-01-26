import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { MessageService } from './messageService/message-service';

@Component({
  selector: 'lib-message',
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class Message {}
