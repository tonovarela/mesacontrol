import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseGetCheckList } from '@app/interfaces/responses/ResponseGetCheckList';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { CheckListDisplay } from '@app/pages/checklist/interfaces/CheckListAnswered';
import { LogEvent, LogEventType } from '@app/pages/checklist/interfaces/LogEvent';
import { environment } from '@environments/environment.development';
import { firstValueFrom, of } from 'rxjs';

export type  PropsSaveCheckList={
  orden: string; 
  
  id_checklist:string;
  isRefused: boolean; // Indica si la lista de verificación fue rechazada
  optionsAprobed: any[]; // Opciones respondidas por el usuario
  optionsRejected: any[]; // Opciones rechazadas por el usuario
}

export type Option = {
  id:number;
  label: string;    
  optional?: boolean;     
  answer: number | null; // Opcional, si no se necesita, se puede omitir
  comments?: string; // Opcional, si no se necesita, se puede omitir    
  answered: boolean; // Indica si la opción ha sido respondida
  
}
@Injectable({
  providedIn: 'root'
})
export class CheckListService  {


  private readonly API_URL = environment.apiUrl
  private http = inject(HttpClient)
  private _checkList  = signal<CheckListDisplay | null >(null);  
  private router = inject(Router);


  public id_checkListCurrent ='';
  public checkList = computed(() => this._checkList());
  public currentMetricsOP = signal<OrdenMetrics | null >(null);
  

  constructor() { }
  
  saveChecklist(props:PropsSaveCheckList) {    
    return this.http.post(`${this.API_URL}/api/checklist/registrar`, {...props});
  }

  

  async loadChecklist()  {
    const opMetrics = this.currentMetricsOP()?.NoOrden || '';
     try {      
         const observable =this.http.get<ResponseGetCheckList>(`${this.API_URL}/api/checklist/${this.id_checkListCurrent}?orden=${opMetrics}`);
          const {checkList:detail,checkListDetalle } = await firstValueFrom(observable);                      
          const logEvent:LogEvent =
          {
            type: LogEventType.REJECTED,
            by: "tonovarela",
            date: new Date(),
            extraInformation: "No se pudo completar la verificación"
          };

          const options = checkListDetalle.map((item) => ({
            id: item.id,
            label: item.label,
            optional: item.optional === '1', 
            answer: item.answer,
            answered: item.answer!=null,
            logEvents: item.id === "1b87138d-5e2b-410f-9444-6e47f2ee717d" ?  [logEvent,{...logEvent,date:new Date, by:"Mata"}]:[], // Si es la opción 0, no tiene eventos
            
          }));          
          this._checkList.set({detail, options});    
          
        }catch(error) {
          this._checkList.set(null);
          this.router.navigate(['/home']);
        }
 }
   
 removeActiveCheckList() {
  this._checkList.set(null);
  this.currentMetricsOP.set(null);
  this.id_checkListCurrent = '';
  
  
 }

}
