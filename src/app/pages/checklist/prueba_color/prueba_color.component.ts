
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChecklistViewComponent } from '../components/checklist-view/checklist-view.component';


@Component({
  selector: 'app-prueba-color', 
  imports:[ChecklistViewComponent],
  templateUrl: './prueba_color.component.html',
  styleUrl: './prueba_color.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PruebaColorComponent { 
 
checkList = [ // Tus datos de opciones
    { id: '1', label: 'Plotter Preprensa', checked: false },
    { id: '2', label: 'Mascarilla Suaje', checked: false },
    { id: '3', label: 'Responsiva cliente', checked: false },
    { id: '4', label: 'Mascaras de acabados (opc)', checked: false },
    { id: '5', label: 'Etiqueta de ID', checked: false }
  ];

}
