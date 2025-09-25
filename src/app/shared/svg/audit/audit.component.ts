import { ChangeDetectionStrategy, Component,  input ,output} from '@angular/core';


@Component({
  selector: 'audit-svg',
  imports: [],
  templateUrl: './audit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditComponent  { 
  enabled = input.required<boolean>();  
  onClick = output<void>();
  color = input<string>('text-gray-500');
  

  
  


  goRoute(){
   if (this.enabled()) {
      this.onClick.emit();
    }
  }

}
