import { CommonModule } from '@angular/common';
import {  ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Option } from '../../interfaces/Option';
import { CheckListAnswered, CheckListDisplay, OptionAnswered } from '../../interfaces/CheckListAnswered';
import { PrimeModule } from '@app/lib/prime.module';
import { UiService } from '@app/services';
import { LogEventComponent } from '../log-event/log-event.component';


@Component({
  selector: 'checklist-view',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule, PrimeModule,LogEventComponent],
  templateUrl: './checklist-view.component.html',
  styleUrl: './checklist-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistViewComponent   {

  public checklistForm!: FormGroup;
  private router = inject(Router);  
  private uiService = inject(UiService);

  isSaving = input<boolean>(false);
  checkList = input.required<CheckListDisplay>();
  title = input.required<string>();
  onSave = output<CheckListAnswered>();
  lastPageVisited = input<string>();

  options =computed(() => {
    return this.checkList()?.options || [];
  });

  canSaveFragment = computed(()=> {
    const detail = this.checkList()?.detail;
    return detail ? detail.id_estado=="3" : false;
  }
  );

  

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

      
    this.checklistForm = this.fb.group({
      opciones: this.fb.array(
        this.options().map((opcion: Option) =>
          this.fb.group({
            ...opcion,
            answer: [opcion.answer, 
              !this.canSaveFragment()?[Validators.required]:[]],
            comments: ['']
          })
        )
      ),
    });
  }

  get opciones(): FormArray {
    return this.checklistForm.get('opciones') as FormArray;
  }



  get_Option(id_opcion:string): Option | null {
    const option = this.options().find((option: Option) => option.id === id_opcion);
    return option ? option : null;
  }



  
  regresar(): void {
    this.router.navigate([this.lastPageVisited() || '/preprensa']);
  
  }

  

  onOptionChange(event: any, indexPregunta: number): void {    
    const { value } = event;            
    this.opciones.at(indexPregunta).setValue({ ...this.opciones.at(indexPregunta).value, answer: value });   
  }



  isCompleteFormRequired = computed(() => {
    if (this.canSaveFragment()) {
      return true;     
    }
    return this.checklistForm.valid;                  
  });
    


  canSave = computed(() => {
    return this.checkList().detail?.id_estado !="2";
  });


  onSubmit(): void {  
   if (!this.checklistForm.valid) {
    return;
   }
    const formValue = this.checklistForm.value;    
    const checkList = this.options() as Option[];
    const selectedOptions:OptionAnswered[] = [
       ...formValue.opciones.filter((option:Option)=>!option.answered)
                  .map((option: OptionAnswered, i: number) => ({
        ...checkList.find((opcion: Option) => opcion.id === option.id),
        answer: option.answer,
        isMissingComments : option.answer ==2 && option.comments.length==0,
        comments:option.answer !=2?'':option.comments
      }))
    ];
    const canSave = selectedOptions.filter((option: OptionAnswered) => option.isMissingComments  ).length == 0;
    
    if (!canSave) {
      this.uiService.mostrarAlertaError('','Debe ingresar un comentario para las opciones rechazadas');      
      return;
    }      
    
    const optionsAnswered =selectedOptions.filter((option: OptionAnswered) =>!option.answered && option.answer !=null );    
    if (this.canSaveFragment() && optionsAnswered.length == 0) {
      this.uiService.mostrarAlertaError('','Debe seleccionar al menos una opción para guardar el checklist');      
      return;
    }               
    this.onSave.emit({ optionsAnswered });

  }

  

}
