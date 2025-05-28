import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Option } from '../../interfaces/Option';
import { CheckListAnswered } from '../../interfaces/CheckListAnswered';
import { PrimeModule } from '@app/lib/prime.module';

@Component({
  selector: 'checklist-view',
  imports: [ReactiveFormsModule,FormsModule, CommonModule, RouterModule,PrimeModule],
  templateUrl: './checklist-view.component.html',
  styleUrl: './checklist-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistViewComponent {

  checklistForm!: FormGroup;
  router = inject(Router);

  checkList = input.required<Option[]>();
  title = input.required<string>();
  onSave = output<CheckListAnswered>();


  paymentOptions: any[] = [
    { name: 'Aceptado', value: 1 },
    { name: 'Rechazado', value: 2 },
    { name: 'No aplica', value: 3 }
];

value!: number;



  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.checklistForm = this.fb.group({
      opciones: this.fb.array(this.checkList().map((opcion: any) => this.fb.control(opcion.checked))),
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
    if (!this.checklistForm.valid) {
      return
    }
    const formValue = this.checklistForm.value;
    const checkList = this.checkList() as any;
    const selectedOptions: Option[] = formValue.opciones
      .map((checked: boolean, i: number) => ({ ...checkList[i], checked }))
    this.onSave.emit({ selectedOptions });

  }

}
