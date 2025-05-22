import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
      path: 'home', component: MainLayoutComponent,
      children: [
        {
            path:"", loadComponent: () => import('./pages/home/home.component')
        }
        
      ]
    },
    {
      path: 'checklist', component: MainLayoutComponent,
      children: [
        { 
          path: 'dummy_vestido', loadComponent: () => import('./pages/checklist/dummy_vestido/dummy_vestido.component')
        },
        {
          path: 'dummy_blanco', loadComponent: () => import('./pages/checklist/dummy_blanco/dummy_blanco.component')
        },
        {
          path: 'prueba_color', loadComponent: () => import('./pages/checklist/prueba_color/prueba_color.component')
        }
      ]
    },
    { path: '**', redirectTo: 'home' }
  ];

