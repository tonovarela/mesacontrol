import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';


export const routes: Routes = [
  {
    path: 'preprensa', component: MainLayoutComponent,
    children: [
      { path: "pendientes", data: { pendientes: true, titulo: 'Preprensa   |  Ordenes pendientes' }, loadComponent: () => import('./pages/preprensa/preprensa.component') },
      { path: "liberadas", data: { pendientes: false, titulo: 'Preprensa  |  Ordenes liberadas' }, loadComponent: () => import('./pages/preprensa/preprensa.component') },
      { path: "omisiones", loadComponent: () => import('./pages/omisiones/omisiones.component') },
      { path: '**', redirectTo: 'pendientes' }
    ]
  },  
  {
    path: 'produccion', component: MainLayoutComponent,
    children: [
      { path: "pendientes", data: { pendientes: true }, loadComponent: () => import('./pages/produccion/pages/produccion/produccion.component') },
      { path: "liberadas", data: { pendientes: false }, loadComponent: () => import('./pages/produccion/pages/produccion/produccion.component') },
      { path: '**', redirectTo: 'pendientes' }
    ]
  },
  {
    path: 'control_elementos', component: MainLayoutComponent,
    children: [
      { path: "solicitudes",data:{modulo:'activas'},loadComponent: () => import('./pages/control_elementos/pages/solicitudes/solicitudes.component') },
      { path: "historico", data:{modulo:"historico"},loadComponent: () => import('./pages/control_elementos/pages/solicitudes/solicitudes.component') },
      {  path: "nueva", loadComponent: () => import('./pages/control_elementos/pages/nueva/nueva.component') },
      {  path: "devolucion/:orden", loadComponent: () => import('./pages/control_elementos/pages/devolucion/devolucion.component') },
       { path: '**', redirectTo: 'solicitudes' }

    ]
  },
  {
    path: 'rollcall', component: MainLayoutComponent,
    children: [
      { path: "", loadComponent: () => import('./pages/checklist/pages/rollcall/rollcall.component')},
      {path:"liberacion/:orden", loadComponent: () => import('./pages/checklist/pages/liberacion/liberacion.component')},
      { path: '**', redirectTo: '' }
    ]
  },
  { path: '**', redirectTo: 'preprensa' }
];

