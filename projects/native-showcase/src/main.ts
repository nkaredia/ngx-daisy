import './app/icons/app-svg-icon';
import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication, runNativeScriptAngularApp } from '@nativescript/angular';
import { NativeShowcase } from './app/app.component';

runNativeScriptAngularApp({
  appModuleBootstrap: () =>
    bootstrapApplication(NativeShowcase, { providers: [provideZonelessChangeDetection()] }),
});
