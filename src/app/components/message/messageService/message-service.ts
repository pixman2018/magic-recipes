import { Injectable, Signal, signal } from '@angular/core';
import { I_ConfirmState, I_MessageState } from '../message_confirem.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // Das Signal hält die Konfiguration oder null (wenn geschlossen)
  private _confirmDialog = signal<I_ConfirmState | null>(null);
  private _messageDialog = signal<I_MessageState | null>(null);

  public get confirmDialog(): Signal<I_ConfirmState | null> {
    return this._confirmDialog.asReadonly();
  }

  // Diese Funktion gibt ein Promise zurück, auf das du im Code warten kannst
  public ask(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this._confirmDialog.set({ title, message, resolve });
    });
  }

  public handleAnswer(answer: boolean) {
    const current = this._confirmDialog();
    if (current) {
      current.resolve(answer); // Das Promise auflösen
      this._confirmDialog.set(null); // Dialog schließen
    }
  }

  /**
   *****
   ***
   * Message
   ***
   *****
   */
  public setMessage({
    title,
    message,
    type = 'success',
    autoclose = false,
    openTime = 5000,
  }: I_MessageState): void {
    this._messageDialog.set({ title, message, type, autoclose, openTime });

    if (autoclose) {
      setTimeout(() => this.closeMessage(), openTime);
    }
  }

  public getMessage(): Signal<I_MessageState | null> {
    return this._messageDialog.asReadonly();
  }

  public closeMessage(): void {
    this._messageDialog.set(null);
  }
}
