import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChecklistViewComponent } from '../../../components/checklist-view/checklist-view.component';
import { Option } from '../../../interfaces/Option';
import { CheckListAnswered } from '../../../interfaces/CheckListAnswered';

@Component({
  
  imports: [ChecklistViewComponent],
  templateUrl: './dummy_blanco.component.html',
  styleUrl: './dummy_blanco.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DummyBlancoComponent {

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
