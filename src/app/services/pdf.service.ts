import { Injectable } from '@angular/core';
import { cuerpoMarbete, MarbeteProps } from '@app/templates_print/marbete_checklist';
import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts'; // Carga las fuentes predeterminadas de pdfMake

// const fonts = {
//   Roboto: {
//     normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
//     bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
//     italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
//     bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
//   },  
// };



@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public async obtenerPDF(cuerpoMarbeteProps: MarbeteProps) {
    const doc = cuerpoMarbete(cuerpoMarbeteProps);
    const documento = pdfMake.createPdf(doc);
    documento.open(); // Abre el PDF directamente en una nueva pestaña
  }





}