import { Injectable } from '@angular/core';
import { ComponenteSobre } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { columnas } from '@app/pages/data/columnas';
import { cuerpoMarbete, cuerpoSobre, MarbeteProps } from '@app/templates_print/marbete_checklist';

import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts'; // Carga las fuentes predeterminadas de pdfMake


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }  

 columnasAuditoria = columnas;

 async descargarMarbetePDF(data: any,sobreContenido:ComponenteSobre[],nombreUsuario:string,preMarbete =false) {    
    if (sobreContenido.length==0) {
      return;
    }
    
    await this.generarMarbete( {
      vendedor: data?.Vendedor || '',   
      contenidoSobre:sobreContenido,   
      numero_orden: data?.NoOrden || '',
      nombre_trabajo: data?.NombreTrabajo || '',
      cliente: data?.NombreCliente || '',      
      preMarbete,
      usuario: nombreUsuario       
    });
    
  }

  


  async descargaSobrePDF(data: any,sobreContenido:ComponenteSobre[]) {
    if (sobreContenido.length==0) {
      return;
    }

  
    await this.generarSobre( {
      vendedor: data?.Vendedor || '',   
      contenidoSobre:sobreContenido,   
      numero_orden: data?.NoOrden || '',
      nombre_trabajo: data?.NombreTrabajo || '',
      cliente: data?.NombreCliente || '',      
      preMarbete:false,
      usuario: ''      
    });
      
    
  }

  // private fechaLiberacion(data: any,col:any)  {
  //   return col.obtenerFechaLiberacion(data);
  // }

  private async generarMarbete(cuerpoMarbeteProps: MarbeteProps) {
    const doc = cuerpoMarbete(cuerpoMarbeteProps);    
    const documento = pdfMake.createPdf(doc);
    documento.open(); // Abre el PDF directamente en una nueva pestaña
  }


  private async generarSobre(cuerpoSobreProps: MarbeteProps) {      
        const doc = cuerpoSobre(cuerpoSobreProps);    
        const documento = pdfMake.createPdf(doc);
        documento.open(); // Abre el PDF directamente en una nueva pestaña
  }





}