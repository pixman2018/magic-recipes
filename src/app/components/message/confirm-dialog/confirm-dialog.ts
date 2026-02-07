import { Component, inject } from '@angular/core';
import { MessageService } from '../messageService/message-service';

/**
 * I n der Componente
 * const ok = await this._messageService.ask(
      'Zutat löschen',
      'Möchtest du diese Zutat wirklich aus der Datenbank entfernen?'
    );

    if (ok) {
      alert('DEL');
    } else {
      alert('break');
    }
 */
@Component({
  selector: 'lib-confirm-dialog',
  imports: [],
  template: `
    @if (confirmService.confirmDialog(); as data) {
      <div class="overlay">
        <div class="dialog">
          <h2>{{ data.title }}</h2>
          <p>{{ data.message }}</p>
          <div class="actions">
            <button (click)="confirmService.handleAnswer(false)">Abbrechen</button>
            <button (click)="confirmService.handleAnswer(true)" class="danger">Bestätigen</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    @import '../messages.scss';
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: grid;
      place-items: center;
      z-index: 1000;
    }
    .dialog {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      max-width: 400px;
    }
    .danger {
      background: red;
      color: white;
    }
  `,
})
export class ConfirmDialog {
  confirmService = inject(MessageService);
}
