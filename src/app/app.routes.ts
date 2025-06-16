import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';


export const routes: Routes = [
  {
    path: 'home', component: MainLayoutComponent,
    children: [
      { path: "pendientes",data:{pendientes:true}, loadComponent: () => import('./pages/home/home.component') },
      { path: "liberadas",data:{pendientes:false},loadComponent: () => import('./pages/home/home.component') },
      { path:'**', redirectTo: 'pendientes' }
    
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

