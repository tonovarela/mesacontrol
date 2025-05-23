import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChecklistViewComponent } from '../components/checklist-view/checklist-view.component';
import { Option } from '../interfaces/Option';
import { CheckListAnswered } from '../interfaces/CheckListAnswered';

@Component({
  selector: 'app-dummy-blanco',
  imports: [ChecklistViewComponent],
  templateUrl: './dummy_blanco.component.html',
  styleUrl: './dummy_blanco.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DummyBlancoComponent {

  checkList:Option[] = [ // Tus datos de opciones
    { id: 1, label: 'Dummy blanco 1', checked: false },
    { id: 2, label: 'Dummy blanco 2', checked: false },
    { id: 3, label: 'Dummy blanco 3', checked: false },
    { id: 4, label: 'Dummy blanco 4', checked: false },
    { id: 5, label: 'Dummy blanco 5', checked: false }
  ];

  onSave(checkList: CheckListAnswered) {
    console.log('Guardando checklist:', checkList);
    // Aquí puedes agregar la lógica para guardar el checklist
  }
 }
