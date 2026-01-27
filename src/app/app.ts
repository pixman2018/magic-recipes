import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/layout/header-component/header-component';
import { Parent } from './example/testing/component/parent/parent';
import { Message } from './components/message/message';
import { MessageService } from './components/message/messageService/message-service';
import { ConfirmDialog } from './components/message/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Message, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
