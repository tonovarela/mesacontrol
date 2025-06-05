import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';


export const routes: Routes = [
  {
    path: 'home', component: MainLayoutComponent,
    children: [{ path: "", loadComponent: () => import('./pages/home/home.component') }
    ]
  },
  {
    path: 'rollcall', component: MainLayoutComponent,
    children: [
      { path: "", loadComponent: () => import('./pages/checklist/pages/rollcall/rollcall.component') }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

