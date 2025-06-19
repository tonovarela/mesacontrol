import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiService } from '@app/services';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {


  public uiService = inject(UiService);
  
  ngOnInit(): void { }

  

}
