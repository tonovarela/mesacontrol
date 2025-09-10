import { AfterViewInit, ChangeDetectionStrategy, Component, input, OnInit, output, ViewChild } from '@angular/core';
import { PrimeModule } from '@app/lib/prime.module';
import { LiberacionComponent } from '@app/pages/preprensa/checklist/components/liberacion/liberacion.component';


@Component({
  selector: 'liberacion-modal',
  imports: [PrimeModule,LiberacionComponent],
  templateUrl: './liberacion.modal.component.html',
  styleUrl: './liberacion.modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiberacionModalComponent implements  OnInit,AfterViewInit {


  @ViewChild('dialogModal') dialogModal :any;
  onClose = output<void>();
  visible= true;

  orden  =  input<string>();


  ngAfterViewInit(): void {
    this.dialogModal.maximized = true;
  }

  ngOnInit() {    
    this.visible= true;    
  }
  
  closeModal(){     
    this.visible= false;   
    this.onClose.emit();
  }

 }
