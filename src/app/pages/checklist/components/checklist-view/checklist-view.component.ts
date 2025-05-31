import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Option } from '../../interfaces/Option';
import { CheckListAnswered } from '../../interfaces/CheckListAnswered';
import { PrimeModule } from '@app/lib/prime.module';

@Component({
  selector: 'checklist-view',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule, PrimeModule],
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


  optionsStrict: any[] = [
    { name: 'Aceptado', value: 1 },
    { name: 'Rechazado', value: 2 },
  
  ];

  optionOptional: any[] = [    
    { name: 'Aceptado', value: 1 },
    { name: 'Rechazado', value: 2 },
    { name: 'No aplica', value: 0 },
  ];
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log('checkList', this.checkList());
    // this.checklistForm = this.fb.group({
    //   opciones: this.fb.array(this.checkList().map((opcion: any) => { id: opcion }  )),      
    // });
    this.checklistForm = this.fb.group({
      opciones: this.fb.array(
        this.checkList().map((opcion: any) =>
          this.fb.control(null, this.isOptionalByOption(opcion) ? [] : [Validators.required])
        )
      ),
    }); 
  }

  private isOptionalByOption(opcion: any): boolean {
    return opcion.optional ?? false;
  }

  get opciones(): FormArray {
    return this.checklistForm.get('opciones') as FormArray;
  }

  // Método para obtener el label de la opción, necesitarás adaptarlo a cómo almacenas tus labels
  obtenerLabelOpcion(index: number): string {
    return this.checkList()[index] ? (this.checkList()[index] as any).label : '';
  }

  isOptional(index: number): boolean {
    return this.checkList()[index] ? (this.checkList()[index] as any).optional : false;
  }

private  obtenerIdOpcion(index: number): number {
    return this.checkList()[index] ? (this.checkList()[index] as any).id : -1;
  }

  
  regresar(): void {
    this.router.navigate(['/home']);
  }


  onSubmit(): void {
    console.log('Formulario enviado:', this.checklistForm.value);
    console.log('Formulario enviado:', this.checklistForm.value);
    if (!this.checklistForm.valid) {
      return
    }
    const formValue = this.checklistForm.value;
    const checkList = this.checkList() as any;
    const selectedOptions: Option[] = formValue.opciones
      .map((checked: boolean, i: number) => ({ ...checkList[i], checked }))
    this.onSave.emit({ selectedOptions });

  }

  onOptionClick(event: any,indexPregunta:number): void {
    const iPregunta= this.obtenerIdOpcion(indexPregunta);
    const { value } = event.option;
    //console.log(event.option.value);    
    console.log(`Opción seleccionada: ${value}`,'ID Pregunta:', iPregunta);
    //console.log('Opción seleccionada:', option);
  }

}
