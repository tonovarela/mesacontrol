import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';




@NgModule({ 
    exports: [MultiSelectModule,FloatLabelModule,TextareaModule,ButtonModule,ToggleSwitchModule, CardModule,ToggleButtonModule,SelectButtonModule,AutoCompleteModule,DialogModule,ListboxModule]
    
   })
export class PrimeModule { }