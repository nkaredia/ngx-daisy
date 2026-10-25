import {
  LucideDynamicIcon,
  LucideCode,
  LucidePanelRight,
  LucidePanelBottom,
  LucideRotateCcw,
} from '@lucide/angular';
import { DsyIcon } from 'ngx-daisy/icon';
import { DsyTooltip } from 'ngx-daisy/tooltip';
import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  inject,
  Type,
  linkedSignal,
  model,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyCollapse } from 'ngx-daisy/collapse';
import { DsyButton } from 'ngx-daisy/button';
import { playgroundActions } from './playground-actions';
import { ExampleCode } from './example-code';
import { PLAYGROUND_CONFIGURATIONS } from './provide-playground';
import type {
  PlaygroundProperty,
  PlaygroundPropsPosition,
  PlaygroundValue,
  PlaygroundValues,
} from './playground.types';

let nextPlaygroundId = 0;

@Component({
  imports: [
    LucideDynamicIcon,
    DsyIcon,
    DsyTooltip,
    DsyCollapse,
    DsyButton,
    NgComponentOutlet,
    ExampleCode,
  ],
  selector: 'demo-playground',
  styleUrl: './playground.scss',
  templateUrl: './playground.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Playground {
  readonly icons = {
    code: LucideCode,
    side: LucidePanelRight,
    bottom: LucidePanelBottom,
    reset: LucideRotateCcw,
  };
  readonly component = input.required<Type<unknown>>();
  private readonly configurations = inject(PLAYGROUND_CONFIGURATIONS, { optional: true }) ?? [];
  private readonly config = computed(() => {
    const matches = this.configurations.filter((config) =>
      config.previews.includes(this.component()),
    );
    if (matches.length !== 1) {
      throw new Error(
        `Preview ${this.component().name} requires exactly one matching configuration registered with providePlayground().`,
      );
    }
    return matches[0];
  });
  readonly sourceFiles = computed(
    () =>
      this.config().exampleSources?.find((source) => source.component === this.component())
        ?.files ?? [],
  );
  readonly propsPosition = model<PlaygroundPropsPosition>('side');
  readonly valuesChange = output<PlaygroundValues>();
  private readonly previewGeneration = signal(0);
  readonly previewGenerations = computed(() => [this.previewGeneration()]);
  readonly actions = playgroundActions;
  readonly id = `playground-${nextPlaygroundId++}`;
  private readonly overrides = linkedSignal({
    source: this.component,
    computation: () => ({}) as Record<number, Record<string, PlaygroundValue>>,
  });
  readonly values = computed<PlaygroundValues>(() =>
    this.config().components.map((component, index) =>
      Object.fromEntries(
        (component.props ?? []).map((prop) => [prop.property, this.value(index, prop)]),
      ),
    ),
  );
  readonly groups = computed(() =>
    this.config().components.map((component, index) => ({
      component,
      controls: (component.props ?? []).map((property) => ({
        property,
        update: (value: PlaygroundValue) => this.setValue(index, property, value),
      })),
    })),
  );

  value(index: number, prop: PlaygroundProperty): PlaygroundValue {
    const overrides = this.overrides()[index];
    return overrides && Object.hasOwn(overrides, prop.property)
      ? overrides[prop.property]
      : prop.default;
  }
  setValue(index: number, prop: PlaygroundProperty, value: PlaygroundValue): void {
    this.overrides.update((current) => ({
      ...current,
      [index]: { ...current[index], [prop.property]: value },
    }));
    this.valuesChange.emit(this.values());
  }
  reset(): void {
    this.overrides.set({});
    this.previewGeneration.update((generation) => generation + 1);
    this.valuesChange.emit(this.values());
  }
}
