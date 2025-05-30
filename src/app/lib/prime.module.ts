import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';


@NgModule({ 
    exports: [ButtonModule,ToggleSwitchModule, CardModule,ToggleButtonModule,SelectButtonModule,AutoCompleteModule,DialogModule]
    
   })
export class PrimeModule { }