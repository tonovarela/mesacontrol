import { TDocumentDefinitions } from "pdfmake/interfaces";
import { logo } from "./logo";

export const cuerpoMarbete = (): TDocumentDefinitions => {
  const docDefinition: TDocumentDefinitions = {
    content: [      
      {
        style: 'tableExample',
        table: {
          widths: ['*', '*'],
          body: [
            [{ text: 'Fecha:', fillColor: '#cccccc' }, { text: 'OP:', fillColor: '#cccccc' }]
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: [100, '*'],
          body: [
            [{ text: 'Cliente:', fillColor: '#cccccc' }, ''],
            [{ text: 'Producto', fillColor: '#cccccc' }, '']
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: [120, 100, '*', '*', 1],
          body: [
            [
              { text: '', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc', },
              { text: 'VALIDACION DE ELEMENTOS', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc' },
              { text: 'CUMPLE', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc', colSpan: 3 },
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' }
            ],
            [
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' },
              { text: 'SI', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc' },
              { text: 'N/A', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc',colSpan: 2 },
              { text: '', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc' },
              
            ],
            [
              { text: 'Liberación al cliente', alignment: 'left', },
              { text: '1. Prueba de color', margin: [10, 0, 0, 0] },
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' ,colSpan: 2},
              { text: '', alignment: 'center' }
            ],
            [
              { text: 'Liberación al cliente', alignment: 'left'  },
              { text: '2. Dummy vestido', margin: [10, 0, 0, 0] },
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' ,colSpan: 2},
              { text: '', alignment: 'center' }
            ],
            [
              { text: 'Liberación sobre viajero', alignment: 'left' },
              { text: '3. Prueba de color', margin: [10, 0, 0, 0] },
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' ,colSpan: 2},
              { text: '', alignment: 'center' }
            ],
            [
              { text: 'Liberación sobre viajero', alignment: 'left' },
              { text: '4. Dummy blanco', margin: [10, 0, 0, 0] },
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center',colSpan: 2 },
              { text: '', alignment: 'center' }
            ],
            [
              { text: 'Liberación sobre viajero', alignment: 'left' },
              { text: '5.  Dummy vestido', margin: [10, 0, 0, 0] },
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' ,colSpan: 2},
              { text: '', alignment: 'center' }
            ],
            [
              { text: 'Liberación sobre viajero', alignment: 'left' },
              { text: '6.  Liberacion', margin: [10, 0, 0, 0] },
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' ,colSpan: 2},
              { text: '', alignment: 'center' }
            ],         
            
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [
            [{ text: 'Reviso:', fillColor: '#cccccc', alignment: 'center' }]
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: [100, '*', '*'],
          body: [
            [
              { text: 'Entrega CTP', fillColor: '#cccccc' },
              { text: 'Nombre y Firma', alignment: 'center' },
              { text: 'Recibe Mesa de Control', fillColor: '#cccccc' }
            ],
            [
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' },
              { text: 'Nombre y Firma', alignment: 'center' }
            ]
          ]
        }
      },
      // {
      //   style: 'tableExample',
      //   table: {
      //     widths: ['*'],
      //     body: [
      //       [{ text: 'Observaciones:', fillColor: '#cccccc' }],
      //       [{ text: '', alignment: 'center' }]
      //     ]
      //   }
      // },
      {
        style: 'tableExample',
        table: {
          widths: [50, '*'],
          body: [
            [
              { text: 'NOTA:', fillColor: '#cccccc' },
              { 
                text: 'Por ningun motivo el usuario del sobre viajero debe de manipular los elementos ya que estos son autorizados por el cliente. Si ya terminaste de ocupar el sobre, favor de regresarlo al area responsable ya que otros procesos lo necesitan.',
                alignment: 'center'
              }
            ]
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      tableExample: {
        margin: [0, 5, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black'
      }
    },
    defaultStyle: {
      fontSize: 10
    }
  };



 
  
  return docDefinition;
};