import { Zap, ChartNoAxesColumn, Keyboard } from 'lucide';
import { lucideArtwork } from '../icons/svg-artwork';
export const nativePages = [
  { id: 'buttons', label: 'Buttons', category: 'actions' },
  { id: 'dropdowns', label: 'Dropdowns', category: 'actions' },
  { id: 'fabs', label: 'FAB / Speed Dial', category: 'actions' },
  { id: 'modals', label: 'Modals', category: 'actions' },
  { id: 'swaps', label: 'Swaps', category: 'actions' },
  { id: 'theme-controllers', label: 'Theme Controllers', category: 'actions' },
  { id: 'inputs', label: 'Input', category: 'data-input' },
  { id: 'textareas', label: 'Textarea', category: 'data-input' },
  { id: 'checkboxes', label: 'Checkbox', category: 'data-input' },
  { id: 'radios', label: 'Radio', category: 'data-input' },
  { id: 'ranges', label: 'Range', category: 'data-input' },
  { id: 'selects', label: 'Select', category: 'data-input' },
  { id: 'form-fields', label: 'Form Field', category: 'data-input' },
  { id: 'fieldsets', label: 'Fieldset', category: 'data-input' },
  { id: 'toggles', label: 'Toggle', category: 'data-input' },
  { id: 'icons', label: 'Icons', category: 'data-display' },
] as const;
export type NativePageId = (typeof nativePages)[number]['id'] | 'themes';
export const nativeGroups = [
  { id: 'actions', label: 'Actions', icon: lucideArtwork(Zap) },
  { id: 'data-display', label: 'Data Display', icon: lucideArtwork(ChartNoAxesColumn) },
  { id: 'data-input', label: 'Data Input', icon: lucideArtwork(Keyboard) },
].map((group) => ({ ...group, pages: nativePages.filter((page) => page.category === group.id) }));
