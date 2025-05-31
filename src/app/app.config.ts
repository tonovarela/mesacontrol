import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
//import Material from '@primeng/themes/material';
import Nora from '@primeng/themes/nora';
import { provideHttpClient } from '@angular/common/http';
import { definePreset } from '@primeng/themes';
//import MyPreset from './mypreset';
//import MyPreset from './mypreset';


const MyPreset = definePreset(Nora, {
  semantic: {
      primary: {
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}'
      }
  }
});


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,withHashLocation()),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme:{
        preset:MyPreset,
        options:{
         
          darkModeSelector:".dark"
        }
      }
    }),
    //provideZoneChangeDetection({ eventCoalescing: true }), 
    
  ]
};
