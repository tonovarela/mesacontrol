import { ChangeDetectionStrategy, Component, type OnInit, signal } from '@angular/core';
import { PrimeModule } from '../../lib/prime.module';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';


@Component({
  selector: 'app-home',
  imports: [PrimeModule,FormsModule,SynfusionModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export  default class HomeComponent extends BaseGridComponent implements OnInit {

  isDarkMode =signal(false);  

  constructor() {
    super();
  }

  protected minusHeight = 0.27;

  registros= signal([
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Alice Johnson', age: 28 },
    { id: 4, name: 'Bob Brown', age: 35 },
    { id: 5, name: 'Charlie Davis', age: 22 },])

  ngOnInit(): void {
    this.autoFitColumns = true; 
    this.iniciarResizeGrid(this.minusHeight);
    
  }


  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
  }

}
