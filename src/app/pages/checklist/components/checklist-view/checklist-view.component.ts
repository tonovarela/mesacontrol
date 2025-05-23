import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray,  Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'checklist-view',
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './checklist-view.component.html',
  styleUrl: './checklist-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistViewComponent { 

  checklistForm!: FormGroup;
  router = inject(Router);
 
  checkList = input.required<any[]>();
  nombreModulo = input.required<string>();
 


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.checklistForm = this.fb.group({
      opciones: this.fb.array(this.checkList().map( (opcion:any) => this.fb.control(opcion.checked))),
      observaciones: ['', Validators.maxLength(200)] // Ejemplo de validación
    });    
  }



  
  get opciones(): FormArray {
    return this.checklistForm.get('opciones') as FormArray;
  }

  // Método para obtener el label de la opción, necesitarás adaptarlo a cómo almacenas tus labels
  obtenerLabelOpcion(index: number): string {    
    return this.checkList()[index] ? (this.checkList()[index] as any).label : '';
  }

  regresar(): void {
    this.router.navigate(['/home']);
  }


  onSubmit(): void {
    if (this.checklistForm.valid) {
      console.log('Formulario enviado:', this.checklistForm.value);
      // Aquí puedes mapear los valores de 'opciones' de nuevo a tus objetos si es necesario
      const formValue = this.checklistForm.value;
      const checkList = this.checkList() as any;
      const selectedOptions = formValue.opciones
        .map((checked: boolean, i: number) => ({ ...checkList[i], checked }))
        .filter((option:any) => option.checked);
      console.log('Opciones seleccionadas:', selectedOptions);
      console.log('Observaciones:', formValue.observaciones);
    }
  }

}
