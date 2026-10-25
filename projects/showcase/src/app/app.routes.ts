import { Routes } from '@angular/router';
import { showcasePages } from './showcase-pages';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'buttons' },
  ...showcasePages.map((page) => ({
    path: page.path,
    title: page.title,
    loadComponent: page.loadComponent,
  })),
  { path: '**', redirectTo: 'buttons' },
];
