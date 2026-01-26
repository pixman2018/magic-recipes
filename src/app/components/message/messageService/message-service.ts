import { Injectable, Signal, signal } from '@angular/core';

interface I_State {
  title: string;
  message: string;
  resolve: (val: boolean) => void;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // Das Signal hält die Konfiguration oder null (wenn geschlossen)
  private _confirmDialog = signal<I_State | null>(null);

  public get confirmDialog(): Signal<I_State | null> {
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
}
