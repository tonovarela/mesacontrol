import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '@environments/environment.development';

declare var DossierView: any;

@Component({
  selector: 'app-omisiones',
  imports: [ CommonModule, ],
  templateUrl: './omisiones.component.html',
  styleUrl: './omisiones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OmisionesComponent implements AfterViewInit  {
  dossierExistencias = null;
  ngAfterViewInit(): void {
    
    const parameters1 = {
      BASE_URL: environment.baseURLDossier,
      projectID: '4144A4A74427236922F4B197856EB90B',
      dossierId: "A50D60064537FF78A1371FAC4E45BB85",
      username: environment.usuarioDossier,
      password: environment.passwordDossier,
      idDossier: "dossierExistencias"
    };

    const dossier1 = new DossierView(parameters1);
    dossier1.show();
  }
  


}
