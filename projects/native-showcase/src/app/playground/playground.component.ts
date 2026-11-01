import { playgroundValue, literalIndex, selectedLiteral, playgroundOptions } from './state';
import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  computed,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Code, PanelBottom, PanelRight, RotateCcw } from 'lucide';
import { DsyButton } from '@ngx-daisy/native/button';
import { DsySelect } from '@ngx-daisy/native/select';
import { DsyToggle } from '@ngx-daisy/native/toggle';
import { DsyInput } from '@ngx-daisy/native/input';
import { NativeIconButton } from '../shell/icon-button';
import { lucideArtwork } from '../icons/svg-artwork';
import { NativeExampleCode } from './example-code';
import type { NativePlaygroundConfig, PlaygroundProperty, PlaygroundValue } from './types';
@Component({
  selector: 'app-native-playground',
  standalone: true,
  imports: [
    NgComponentOutlet,
    NativeIconButton,
    NativeExampleCode,
    DsyButton,
    DsySelect,
    DsyToggle,
    DsyInput,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './playground.html',
  styleUrl: './playground.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativePlayground {
  readonly config = input.required<NativePlaygroundConfig>();
  readonly width = input(360);
  readonly dark = input(false);
  readonly position = linkedSignal({
    source: this.config,
    computation: (): 'side' | 'bottom' => 'side',
  });
  readonly side = computed(() => this.position() === 'side' && this.width() >= 820);
  readonly codeOpen = linkedSignal({ source: this.config, computation: () => false });
  readonly icons = {
    code: lucideArtwork(Code),
    side: lucideArtwork(PanelRight),
    bottom: lucideArtwork(PanelBottom),
    reset: lucideArtwork(RotateCcw),
  };
  readonly overrides = linkedSignal({
    source: this.config,
    computation: () => ({}) as Record<number, Record<string, PlaygroundValue>>,
  });
  private readonly generation = signal(0);
  readonly generations = computed(() => [this.generation()]);
  readonly values = computed(() =>
    this.config().components.map((_, index) => ({
      ...this.config().initialValues?.[index],
      ...this.overrides()[index],
    })),
  );
  readonly files = computed(
    () =>
      this.config().exampleSources?.find((source) => source.component === this.config().previews[0])
        ?.files ?? [],
  );
  value(index: number, prop: PlaygroundProperty): PlaygroundValue {
    return playgroundValue(this.config(), this.overrides(), index, prop);
  }
  set(index: number, prop: PlaygroundProperty, value: PlaygroundValue): void {
    if (Object.is(this.value(index, prop), value)) return;
    this.overrides.update((current) => ({
      ...current,
      [index]: { ...current[index], [prop.property]: value },
    }));
  }
  options(prop: PlaygroundProperty) {
    return playgroundOptions(prop);
  }
  selected(index: number, prop: PlaygroundProperty): string {
    return literalIndex(prop, this.value(index, prop));
  }
  choose(index: number, prop: PlaygroundProperty, selection: string): void {
    const value = selectedLiteral(prop, selection);
    if (value !== undefined) this.set(index, prop, value);
  }
  edit(index: number, prop: PlaygroundProperty, text: string): void {
    if (prop.action.kind === 'number') {
      const number = Number(text);
      if (text.trim() && Number.isFinite(number)) this.set(index, prop, number);
    } else this.set(index, prop, text);
  }
  reset(): void {
    this.overrides.set({});
    this.generation.update((value) => value + 1);
  }
  togglePosition(): void {
    this.position.update((value) => (value === 'side' ? 'bottom' : 'side'));
  }
}
