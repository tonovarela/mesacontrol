
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChecklistViewComponent } from '../../../components/checklist-view/checklist-view.component';
import { CheckListAnswered } from '../../../interfaces/CheckListAnswered';
import { Option } from '../../../interfaces/Option';

@Component({
  
  imports:[ChecklistViewComponent],
  templateUrl: './prueba_color.component.html',
  styleUrl: './prueba_color.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PruebaColorComponent { 
 
checkList:Option[] = [ // Tus datos de opciones
    { id: 1, label: 'Plotter Preprensa' ,optional: false       , answer: null, comments: '', answered: false },
    { id: 2, label: 'Responsiva Cliente'  ,optional:false      , answer: null, comments: '', answered: false },
    { id: 3, label: 'Máscara de acabados (opc)',optional: true , answer: null, comments: '', answered: false },    
    { id: 4, label: 'Etiqueta de ID', optional: false          , answer: null, comments: '', answered: false },
  ];

  onSave(checkList: CheckListAnswered) {
    console.log('Guardando checklist:', checkList);
    // Aquí puedes agregar la lógica para guardar el checklist
  }

}
