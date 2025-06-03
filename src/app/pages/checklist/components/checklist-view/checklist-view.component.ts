import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Option } from '../../interfaces/Option';
import { CheckListAnswered } from '../../interfaces/CheckListAnswered';
import { PrimeModule } from '@app/lib/prime.module';
import { UiService } from '@app/services';

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

  private uiService = inject(UiService);
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
   
    this.checklistForm = this.fb.group({
      opciones: this.fb.array(
        this.checkList().map((opcion: Option) =>
          this.fb.group({
            ...opcion,
            answer: [opcion.answer, this.isOptionalByOption(opcion) ? [] : [Validators.required]],
            comments: ['']
          })
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

  
  regresar(): void {
    this.router.navigate(['/home']);
  }

  onOptionClick(event: any,indexPregunta:number): void {
    //const iPregunta= this.obtenerIdOpcion(indexPregunta);
    const { value } = event.option;        
    this.opciones.at(indexPregunta).setValue({ ...this.opciones.at(indexPregunta).value, answer: value });   
  }






  onSubmit(): void {  
    if (!this.checklistForm.valid) {
      return
    }
    const formValue = this.checklistForm.value;
    
    const checkList = this.checkList() as any;
    const selectedOptions = [
       ...formValue.opciones.map((option: any, i: number) => ({
        ...checkList[i],
        answer: option.answer,
        isMissingComments : option.answer ==2 && option.comments.length==0,
        comments:option.answer !=2?'':option.comments
      }))
    ];


    const canSave = selectedOptions.filter((option: any) => option.isMissingComments).length == 0;
    if (!canSave) {
      this.uiService.mostrarAlertaError('','Debe ingresar un comentario para las opciones rechazadas');      
      return;
    }      
    const esRechazado = selectedOptions.filter((option: any) => option.answer == 2).length > 0;
    console.log('esRechazado', esRechazado);
    this.onSave.emit({ selectedOptions });

  }

  

}
