import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const lightmode = localStorage.getItem('lightmode');
const preference = window.matchMedia('(prefers-color-scheme: light)');
if (lightmode || preference.matches) {
  document.body.classList.add('lightmode');
} else {
  document.body.classList.remove('lightmode');
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
