import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { FieldState, FieldTree } from '@angular/forms/signals';

/**
 * Pass a FieldTree (form.control) with input binding
 */
@Component({
  selector: 'lib-error-message',
  imports: [JsonPipe],
  templateUrl: './error-message.html',
  styleUrl: './error-message.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessage {
  public control = input.required<FieldTree<string | number, string | number>>();
}
