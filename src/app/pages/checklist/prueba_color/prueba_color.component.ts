import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-prueba-color',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './prueba_color.component.html',
  styleUrl: './prueba_color.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PruebaColorComponent { 
  checklistForm!: FormGroup;
  opcionesData = [ // Tus datos de opciones
    { id: 'op1', label: 'Opción Dinámica 1', checked: false },
    { id: 'op2', label: 'Opción Dinámica 2', checked: true },
    { id: 'op3', label: 'Opción Dinámica 3', checked: false },
    { id: 'op4', label: 'Opción Dinámica 4', checked: false },
  ];


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.checklistForm = this.fb.group({
      opciones: this.fb.array(this.opcionesData.map(opcion => this.fb.control(opcion.checked))),
      observaciones: ['', Validators.maxLength(200)] // Ejemplo de validación
    });
    console.log('Formulario inicializado:', this.checklistForm.value);
  }

  get opciones(): FormArray {
    return this.checklistForm.get('opciones') as FormArray;
  }

  // Método para obtener el label de la opción, necesitarás adaptarlo a cómo almacenas tus labels
  obtenerLabelOpcion(index: number): string {
    return this.opcionesData[index] ? this.opcionesData[index].label : '';
  }

  onSubmit(): void {
    if (this.checklistForm.valid) {
      console.log('Formulario enviado:', this.checklistForm.value);
      // Aquí puedes mapear los valores de 'opciones' de nuevo a tus objetos si es necesario
      const formValue = this.checklistForm.value;
      const selectedOptions = formValue.opciones
        .map((checked: boolean, i: number) => ({ ...this.opcionesData[i], checked }))
        .filter((option:any) => option.checked);
      console.log('Opciones seleccionadas:', selectedOptions);
      console.log('Observaciones:', formValue.observaciones);
    }
  }

}
