
import { formatDate } from "@app/utils/formatDate";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { logoLito } from "./logo";


export interface MarbeteProps {
   numero_orden: string;
   nombre_trabajo: string;
   cliente:string;
   usuario:string;
   fecha_liberacion:(string | null)[]

}

export const cuerpoMarbete = (props:MarbeteProps): TDocumentDefinitions => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son base 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const formatedDate = `${day}/${month}/${year} ${hours}:${minutes} hrs`;
  const docDefinition: TDocumentDefinitions = {
    content: [      
      { image: `data:image/png;base64,${logoLito}`,  width: 150, margin: 5, fontSize: 7,  alignment: 'left' },
      {
        style: 'tableExample',
        table: {
          widths: ['*', '*'],
          body: [
            [{ text: `Fecha: ${formatedDate}`, fillColor: '#cccccc' }, { text: `OP: ${props.numero_orden}`, fillColor: '#cccccc' }]
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: [100, '*'],
          body: [
            [{ text: `Nombre:  `, fillColor: '#cccccc' }, `${props.nombre_trabajo}`],
            [{ text: `Cliente:`, fillColor: '#cccccc' }, ` ${props.cliente}`]            
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: [120, 100, '*', '*', 1],
          body: [
            [
              { text: 'VALIDACION DE ELEMENTOS', margin: [0, 10, 0, 0],style: 'tableHeader', alignment: 'center', fillColor: '#cccccc',colSpan: 2,rowSpan: 2 },
              { text: '', alignment: 'left', fillColor: '#cccccc' },
              { text: 'CUMPLE', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc', colSpan: 3 },
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' }
            ],
            [
              { text: '', alignment: 'center' },
              { text: '', alignment: 'center' },
              { text: 'FECHA DE APROBACIÓN', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc' },
              { text: 'N/A', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc',colSpan: 2 },
              { text: '', style: 'tableHeader', alignment: 'center', fillColor: '#cccccc' },
              
            ],
            [
              { text: 'Liberación al cliente', alignment: 'left',margin: [0, 10, 0, 0],rowSpan:2 },
              { text: 'Prueba de color', margin: [10, 0, 0, 0] },              
              { text: props.fecha_liberacion[0]?`${props.fecha_liberacion[0]}`:'', alignment: 'center' },
              { text: `${!props.fecha_liberacion[0]?'X':''}`, alignment: 'center' ,colSpan: 2},
              
            ],
            [
              { text: '', alignment: 'left'  },
              { text: 'Dummy vestido', margin: [10, 0, 0, 0] },
              { text: props.fecha_liberacion[1]?`${props.fecha_liberacion[1]}`:'', alignment: 'center' },
              { text: `${!props.fecha_liberacion[1]?'X':''}`, alignment: 'center' ,colSpan: 2},
              
            ],
            
            [
              { text: 'Liberación sobre viajero', margin: [0, 25, 0, 0], alignment: 'left' ,rowSpan: 4},
              { text: 'Prueba de color', margin: [10, 0, 0, 0] },
              { text: props.fecha_liberacion[2]?`${props.fecha_liberacion[2]}`:'', alignment: 'center' },
              { text: `${!props.fecha_liberacion[2]?'X':''}`, alignment: 'center' ,colSpan: 2},
              
            ],
            [
              { text: '', alignment: 'left' },
              { text: 'Dummy blanco', margin: [10, 0, 0, 0] },
              { text: props.fecha_liberacion[3]?`${props.fecha_liberacion[3]}`:'', alignment: 'center' },
              { text: `${!props.fecha_liberacion[3]?'X':''}`, alignment: 'center' ,colSpan: 2},
              
            ],
            [
              { text: '', alignment: 'left' },
              { text: 'Dummy vestido', margin: [10, 0, 0, 0] },
              { text: props.fecha_liberacion[4]?`${props.fecha_liberacion[4]}`:'', alignment: 'center' },
              { text: `${!props.fecha_liberacion[4]?'X':''}`, alignment: 'center' ,colSpan: 2},
              
            ],
            [
              { text: '', alignment: 'left' },
              { text: 'Liberacion', margin: [10, 0, 0, 0] },
              { text: props.fecha_liberacion[5]?`${props.fecha_liberacion[5]}`:'', alignment: 'center' },
              { text: `${!props.fecha_liberacion[5]?'X':''}`, alignment: 'center' ,colSpan: 2},
              
            ],        
            
          ]
        }
      },
      
      {
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: [            
            [
                          
              { text: `  ${props.usuario}`, alignment: 'center' }
            ]
          ]
        }
      },
      
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
        fontSize: 10,
        color: 'black'
      }
    },
    defaultStyle: {
      fontSize: 10
    }
  };



 
  
  return docDefinition;
};