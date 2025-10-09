import { Injectable } from '@angular/core';
import { ComponenteSobre } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { columnas } from '@app/pages/data/columnas';
import { cuerpoMarbete, MarbeteProps } from '@app/templates_print/marbete_checklist';
import { formatDate } from '@app/utils/formatDate';

import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts'; // Carga las fuentes predeterminadas de pdfMake


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  
 columnasAuditoria = columnas;

 async descargarPDF(data: any,sobreContenido:ComponenteSobre[],nombreUsuario:string,preMarbete =false) {    
    if (sobreContenido.length==0) {
      return;
    }
    let liberacionesCheckList =this.columnasAuditoria.map((col) => {
      const date = this.fechaLiberacion(data, col);
      return !date? null : formatDate(date);      
    });      

    await this.obtenerPDF( {
      vendedor: data?.Vendedor || '',   
      contenidoSobre:sobreContenido,   
      numero_orden: data?.NoOrden || '',
      nombre_trabajo: data?.NombreTrabajo || '',
      cliente: data?.NombreCliente || '',
      fecha_liberacion:liberacionesCheckList,
      preMarbete,
      usuario: nombreUsuario       
    });
    
  }

  fechaLiberacion(data: any,col:any)  {
    return col.obtenerFechaLiberacion(data);
  }





  public async obtenerPDF(cuerpoMarbeteProps: MarbeteProps) {
    const doc = cuerpoMarbete(cuerpoMarbeteProps);
    const documento = pdfMake.createPdf(doc);
    documento.open(); // Abre el PDF directamente en una nueva pestaña
  }





}