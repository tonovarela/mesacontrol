import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

import ViajeroPruebaColorComponent from './pages/checklist/pages/viajero/prueba_color/prueba_color.component';
import ViajeroDummyBlancoComponent from './pages/checklist/pages/viajero/dummy_blanco/dummy_blanco.component';
import ViajeroDummyVestidoComponent from './pages/checklist/pages/viajero/dummy_vestido/dummy_vestido.component';



import ClientePruebaColorComponent from './pages/checklist/pages/cliente/prueba_color/prueba_color.component';
import ClienteDummyVestidoComponent from './pages/checklist/pages/cliente/dummy_vestido/dummy_vestido.component';
import SobreComponent from './pages/checklist/pages/viajero/sobre/sobre.component';





export const routes: Routes = [
  {
    path: 'home', component: MainLayoutComponent,
    children: [
      {
        path: "", loadComponent: () => import('./pages/home/home.component')
      }

    ]
  },
  {
    path: 'checklist', component: MainLayoutComponent,
    children: [
      {
        path: 'cliente', children: [
          { path: 'prueba_color', component: ClientePruebaColorComponent },
          { path: 'dummy_vestido', component: ClienteDummyVestidoComponent },
        ]
      },
      {
        path: 'viajero', children: [
          { path: 'dummy_blanco', component: ViajeroDummyBlancoComponent },
          { path: 'dummy_vestido', component: ViajeroDummyVestidoComponent },
          { path: 'prueba_color', component: ViajeroPruebaColorComponent },
          { path: 'sobre', component: SobreComponent }
        ]
      }


    ]
  },
  { path: '**', redirectTo: 'home' }
];

