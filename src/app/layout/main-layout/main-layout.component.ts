import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiService } from '@app/services';
import { AsistenteComponent } from '@app/shared/asistente/asistente.component';
import { environment } from '@environments/environment.development';

declare var iniciarAsistente: any;
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,CommonModule,AsistenteComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent  implements AfterViewInit {



  public uiService = inject(UiService);
  

  
  

  ngAfterViewInit(): void {
  
    setTimeout(()=>iniciarAsistente(),500);    
  }


  

  

}
