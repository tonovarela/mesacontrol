import { Component, inject, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { initFlowbite } from 'flowbite';
import { UiService } from './services';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent,SidebarComponent,RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isDarkMode = signal(false);
  public uiService = inject(UiService);
  constructor() {
    setTimeout(() => {
      this.uiService.cargarSidebar();
      initFlowbite();      
    }, 1000);
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark');
    this.isDarkMode.set(!this.isDarkMode());
  }
}
