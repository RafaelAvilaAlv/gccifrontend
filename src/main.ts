import 'zone.js'; // 🔥 IMPORTANTE: necesario para ngx-toastr y Angular con zone

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));