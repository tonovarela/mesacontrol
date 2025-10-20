import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterService, GridModule, PageService, ResizeService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { registerLicense } from '@syncfusion/ej2-base';
import { TabsModule } from 'primeng/tabs';


registerLicense("Ngo9BigBOggjHTQxAR8/V1NHaF1cWWhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEZiWH1WcXZXRWFcVkB3Wg==");
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [SortService, ResizeService, PageService, FilterService,ToolbarService],
  exports:[GridModule,ToolbarModule,TabsModule],
})
export class SynfusionModule { }