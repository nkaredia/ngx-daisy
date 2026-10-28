import { Zap, ChartNoAxesColumn, Keyboard } from 'lucide';
import { lucideArtwork } from '../icons/svg-artwork';
export const nativePages = [
  {
    id: 'buttons',
    description: 'Buttons communicate actions, from a quick confirmation to your next big step.',
    label: 'Buttons',
    category: 'actions',
  },
  {
    id: 'dropdowns',
    description: 'Keep contextual actions close to the content they belong to.',
    label: 'Dropdowns',
    category: 'actions',
  },
  {
    id: 'fabs',
    description: 'Make the primary action easy to reach, with related actions a tap away.',
    label: 'FAB / Speed Dial',
    category: 'actions',
  },
  {
    id: 'modals',
    description: 'Focus attention on a decision or task without losing your place.',
    label: 'Modals',
    category: 'actions',
  },
  {
    id: 'swaps',
    description: 'Switch between two states with one clear, accessible action.',
    label: 'Swaps',
    category: 'actions',
  },
  {
    id: 'theme-controllers',
    description: 'Let people choose the appearance that works for them.',
    label: 'Theme Controllers',
    category: 'actions',
  },
  {
    id: 'inputs',
    description: 'Collect clear, meaningful information with validation along the way.',
    label: 'Input',
    category: 'data-input',
  },
  {
    id: 'textareas',
    description: 'Give longer thoughts room to grow, with helpful guidance and feedback.',
    label: 'Textarea',
    category: 'data-input',
  },
  {
    id: 'checkboxes',
    description: 'Choose one or more options, with support for grouped and mixed states.',
    label: 'Checkbox',
    category: 'data-input',
  },
  {
    id: 'radios',
    description: 'Make one choice from a related set of options.',
    label: 'Radio',
    category: 'data-input',
  },
  {
    id: 'ranges',
    description: 'Adjust a value along a continuous range using a native slider.',
    label: 'Range',
    category: 'data-input',
  },
  {
    id: 'selects',
    description: 'Choose from a set of options in an anchored menu.',
    label: 'Select',
    category: 'data-input',
  },
  {
    id: 'form-fields',
    description: 'Bring labels, controls, hints and validation into one consistent field.',
    label: 'Form Field',
    category: 'data-input',
  },
  {
    id: 'fieldsets',
    description: 'Organize related controls into clear, meaningful groups.',
    label: 'Fieldset',
    category: 'data-input',
  },
  {
    id: 'toggles',
    description: 'Turn settings on or off with immediate, visible feedback.',
    label: 'Toggle',
    category: 'data-input',
  },
  {
    id: 'icons',
    description: 'Bring your own icon library and give it a consistent size, color and meaning.',
    label: 'Icons',
    category: 'data-display',
  },
] as const;
export type NativePageId = (typeof nativePages)[number]['id'] | 'themes';
export const nativeGroups = [
  { id: 'actions', label: 'Actions', icon: lucideArtwork(Zap) },
  { id: 'data-display', label: 'Data Display', icon: lucideArtwork(ChartNoAxesColumn) },
  { id: 'data-input', label: 'Data Input', icon: lucideArtwork(Keyboard) },
].map((group) => ({ ...group, pages: nativePages.filter((page) => page.category === group.id) }));
