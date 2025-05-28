import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';
import { provideHttpClient } from '@angular/common/http';
//import MyPreset from './mypreset';
//import MyPreset from './mypreset';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,withHashLocation()),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme:{
        preset:Material,
        options:{
        
          darkModeSelector:".dark"
        }
      }
    }),
    //provideZoneChangeDetection({ eventCoalescing: true }), 
    
  ]
};
