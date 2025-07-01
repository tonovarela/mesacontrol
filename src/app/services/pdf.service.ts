import { Injectable } from '@angular/core';
import { cuerpoMarbete } from '@app/templates_print/marbete_checklist';
import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts'; // Carga las fuentes predeterminadas de pdfMake

 const fonts = {
  Roboto: {
      normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  },
  // Lato: {
  //     normal: `/assets/fonts/Lato-Regular.ttf`,
  //     bold: `/assets/fonts/Lato-Bold.ttf`,
  //     italics: `/assets/fonts/Lato-Italic.ttf`,
  //     bolditalics: `/assets/fonts/Lato-BoldItalic.ttf`
  // }
};

//(<any>pdfMake).fonts = fonts;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public async obtenerPDF() {
    const doc = cuerpoMarbete();
    //const documento = pdfMake.createPdf(doc);
    const documento = pdfMake.createPdf(doc);
  documento.open(); // Abre el PDF directamente en una nueva pestaña
    // const base64getPromise = new Promise((resolve: (value: string) => void, reject) => documento.getBase64((data: string) => resolve(data)));  
    // const base64String = await base64getPromise;  
    // const byteCharacters = atob(base64String);
    // const byteNumbers = new Array(byteCharacters.length).map((_, i) => byteCharacters.charCodeAt(i));
    // const byteArray = new Uint8Array(byteNumbers);
    // const blob = new Blob([byteArray], { type: 'application/pdf' });  
    // const blobUrl = URL.createObjectURL(blob);    

    // //console.log('Blob URL:', blobUrl);
    // window.open(blobUrl, '_blank');



  }





}