import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, output, ViewChild } from '@angular/core';
import { PrimeModule } from '@app/lib/prime.module';
import RollcallComponent from '@app/pages/checklist/components/rollcall/rollcall.component';


@Component({
  selector: 'rollcall-modal',
  imports: [PrimeModule,RollcallComponent],
  templateUrl: './rollcall.modal.component.html',
  styleUrl: './rollcall.modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RollcallModalComponent implements OnInit, AfterViewInit {

  @ViewChild('dialogModal') dialogModal :any;
  onClose = output<void>();
  visible= true;

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
