import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  type Type,
  ViewEncapsulation,
} from '@angular/core';

/** Compact examples retain their own defaults and local interaction, without playground state. */
@Component({
  selector: 'demo-inline-preview',
  imports: [NgComponentOutlet],
  templateUrl: './inline-preview.html',
  styleUrl: './inline-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InlinePreview {
  readonly component = input.required<Type<unknown>>();
}
