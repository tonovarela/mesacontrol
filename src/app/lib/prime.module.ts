import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';




@NgModule({ 
    exports: [ButtonModule,ToggleSwitchModule, CardModule,ToggleButtonModule,SelectButtonModule]
    
   })
export class PrimeModule { }