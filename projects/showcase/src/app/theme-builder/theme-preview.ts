import { LucideSparkles } from '@lucide/angular';
import { LucideX, LucideStar } from '@lucide/angular';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyThemeDefinition, DsyThemeToken } from '@ngx-daisy/cdk/theme';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyBadge } from '@ngx-daisy/cdk/badge';
import { DsyInput } from '@ngx-daisy/cdk/input';
import { DsyCheckbox } from '@ngx-daisy/cdk/checkbox';
import { DsyToggle } from '@ngx-daisy/cdk/toggle';
import { DsyRange } from '@ngx-daisy/cdk/range';
import { DsyProgress } from '@ngx-daisy/cdk/progress';
import { DsyRadialProgress } from '@ngx-daisy/cdk/radial-progress';
import { DsyAlert } from '@ngx-daisy/cdk/alert';
import { DsyTabs, DsyTab, DsyTabPanel } from '@ngx-daisy/cdk/tabs';
import { DsyTextarea } from '@ngx-daisy/cdk/textarea';
import {
  LucideDynamicIcon,
  LucidePlay,
  LucidePause,
  LucideSkipBack,
  LucideSkipForward,
  LucideVolume2,
  LucideShuffle,
  LucideRepeat,
  LucideHeadphones,
  LucideSearch,
  LucideChartPie,
  LucideCheck,
  LucideMail,
  LucideShieldAlert,
  LucidePaperclip,
  LucideMessageSquare,
  LucideArrowUpRight,
} from '@lucide/angular';

@Component({
  selector: 'demo-theme-preview',
  imports: [
    LucideSparkles,
    LucideX,
    LucideStar,
    DsyButton,
    DsyBadge,
    DsyInput,
    DsyCheckbox,
    DsyToggle,
    DsyRange,
    DsyProgress,
    DsyRadialProgress,
    DsyAlert,
    DsyTabs,
    DsyTab,
    DsyTabPanel,
    DsyTextarea,
    LucideDynamicIcon,
    LucidePlay,
    LucidePause,
    LucideSkipBack,
    LucideSkipForward,
    LucideSearch,
    LucideChartPie,
    LucideCheck,
    LucideMail,
    LucideShieldAlert,
    LucidePaperclip,
    LucideMessageSquare,
    LucideArrowUpRight,
  ],
  templateUrl: './theme-preview.html',
  styleUrl: './theme-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ThemePreview {
  readonly view = input<'demo' | 'variants' | 'palette'>('demo');
  readonly theme = input.required<DsyThemeDefinition>();
  readonly semantics = [
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error',
  ] as const;
  readonly variants = ['solid', 'outline', 'soft', 'dash', 'ghost', 'link'] as const;
  readonly sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
  readonly price = signal(50);
  readonly day = signal(14);
  readonly playing = signal(false);
  readonly post = signal('');
  readonly message = signal('');
  readonly yearly = signal(false);
  readonly barHeights = [12, 22, 8, 30, 17, 25, 19, 45, 35, 50, 26, 31, 60, 80, 71, 92];
  readonly categories = [
    { name: 'Hoodies', count: 25, checked: true },
    { name: 'Bags', count: 3, checked: true },
    { name: 'Shoes', count: 0, checked: false },
    { name: 'Accessories', count: 4, checked: false },
  ];
  readonly orders = [
    { name: 'Charlie Chapman', status: 'Send', color: 'info' },
    { name: 'Howard Hudson', status: 'Failed', color: 'error' },
    { name: 'Fiona Fisher', status: 'In progress', color: 'warning' },
    { name: 'Nick Nelson', status: 'Completed', color: 'success' },
    { name: 'Amanda Anderson', status: 'Completed', color: 'success' },
  ] as const;
  readonly books = [
    "Harry Potter and Sorcerer's Stack",
    'Harry Potter and Chamber of Servers',
    'Harry Potter and Prisoner of Azure',
    'Harry Potter and Goblet of Firebase',
    'Harry Potter and Elixir of Phoenix',
    'Harry Potter and Half-Deployed App',
    'Harry Potter and Deathly Frameworks',
  ];
  readonly audioControls = [
    { label: 'Volume', icon: LucideVolume2 },
    { label: 'Shuffle', icon: LucideShuffle },
    { label: 'Repeat', icon: LucideRepeat },
    { label: 'Headphones', icon: LucideHeadphones },
  ];
  readonly palette = [
    'base-100',
    'base-200',
    'base-300',
    'base-content',
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'error',
  ];
  readonly formats = signal<readonly string[]>([]);
  color(name: string) {
    return this.theme().tokens[`--color-${name}` as DsyThemeToken];
  }
  toggleFormat(format: string) {
    this.formats.update((values) =>
      values.includes(format) ? values.filter((value) => value !== format) : [...values, format],
    );
  }
}
