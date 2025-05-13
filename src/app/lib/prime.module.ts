import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ToggleSwitchModule } from "primeng/toggleswitch";




@NgModule({ 
    exports: [ButtonModule,ToggleSwitchModule, CardModule]
    
   })
export class PrimeModule { }