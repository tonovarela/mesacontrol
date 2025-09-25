import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pdf-svg',
  imports: [],
  templateUrl: './pdf.component.html',  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfComponent { }
