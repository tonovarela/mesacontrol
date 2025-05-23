import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChecklistViewComponent } from '../components/checklist-view/checklist-view.component';
import { Option } from '../interfaces/Option';
import { CheckListAnswered } from '../interfaces/CheckListAnswered';

@Component({
  selector: 'app-dummy-vestido',
  imports: [ChecklistViewComponent],
  templateUrl: './dummy_vestido.component.html',
  styleUrl: './dummy_vestido.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export  default class DummyVestidoComponent {

  checkList:Option[] = [ // Tus datos de opciones
    { id: 1, label: 'Dummy Vestino 1', checked: false },
    { id: 2, label: 'Dummy Vestino 2', checked: false },
    { id: 3, label: 'Dummy Vestino 3', checked: false },
    { id: 4, label: 'Dummy Vestino 4', checked: false },
    { id: 5, label: 'Dummy Vestino 5', checked: false }
  ];

  onSave(checkList: CheckListAnswered) {
    console.log('Guardando checklist:', checkList);
    // Aquí puedes agregar la lógica para guardar el checklist
  }
 }
