
import { formatDate } from "@app/utils/formatDate";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { logoLito } from "./logo";
import { ComponenteSobre } from "@app/interfaces/responses/ResponseOrdenMetrics";


export interface MarbeteProps {
   numero_orden: string;
   nombre_trabajo: string;
   cliente:string;
   usuario:string;
   vendedor:string;
   contenidoSobre:ComponenteSobre[],
   preMarbete:boolean,
   fecha_liberacion:(string | null)[]

}

export const cuerpoMarbete = (props: MarbeteProps): TDocumentDefinitions => {
  // Asegurarse que contenidoSobre existe
  const componentes = props.contenidoSobre || [];
  

  // Crear tablas individuales para cada componente (más simple y fiable)
  const tablasComponentes = componentes.map(componente => {
    // Verificar que componente.elementos sea un array
    const elementos = Array.isArray(componente.elementos) ? componente.elementos : [];

    return {
      style: 'columnaContenido',
      margin: [0, 0, 0, 2] as [number, number, number, number], // Corrección de tipo
      table: {
        widths: [ '*'],
        body: [
          [{
            text: componente.componente || 'Componente',
            fillColor: '#e6e6e6',
            bold: true,            
            alignment: 'center',
            fontSize: 5
          }, ],
          ...elementos.map((elemento: string) => [            
            { text: elemento, fontSize: 5 }
          ])
        ]
      }
    };
  });

  // Dividir las tablas en cuatro columnas
  const cuarto = Math.ceil(tablasComponentes.length / 4);
  const columna1 = tablasComponentes.slice(0, cuarto);
  const columna2 = tablasComponentes.slice(cuarto, 2 * cuarto);
  const columna3 = tablasComponentes.slice(2 * cuarto, 3 * cuarto);
  const columna4 = tablasComponentes.slice(3 * cuarto);

  const date = new Date();
  const formatedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} `;

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A6',
    pageOrientation: 'landscape',
    
    pageMargins: [20, 10, 20, 0],
    content: [
      // Encabezado
      {
        columns: [
          { image: `data:image/png;base64,${logoLito}`, width: 60, margin: [0, 0, 0, 0] },
          { width: '*', text: 'Liberado por Mesa de control', fontSize: 6, alignment: 'center', margin: [0, 0, 0, 0] }
        ]
      },

      // Información básica
      {
        style: 'containerTiny',
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: `Fecha: ${formatedDate}`, fillColor: '#cccccc', fontSize: 5 },
              { text: `OP: ${props.numero_orden}`, fillColor: '#cccccc', fontSize: 5 }
            ]
          ]
        },
        margin: [0, 1, 0, 1] as [number, number, number, number] ,// Corrección de tipo
      },

      {
        style: 'containerTiny',
        table: {
          widths: [30, '*'],
          body: [
            [{ text: `Nombre:`, fillColor: '#cccccc', fontSize: 5 }, { text: `${props.nombre_trabajo || ''}`, fontSize: 5 }],
            [{ text: `Cliente:`, fillColor: '#cccccc', fontSize: 5 }, { text: `${props.cliente || ''}`, fontSize: 5 }],
            [{ text: `Vendedor:`, fillColor: '#cccccc', fontSize: 5 }, { text: `${(props.vendedor || '').toUpperCase()}`, fontSize: 5 }]
          ]
        },
        margin: [0, 1, 0, 1] as [number, number, number, number] ,// Corrección de tipo
      },

      // Título del contenido
      {
        style: 'containerTiny',
        table: {
          widths: ['*'],
          body: [[{ text: 'CONTENIDO DEL SOBRE', fillColor: '#cccccc', bold: true, alignment: 'center', fontSize: 5 }]]
        },
        margin: [0, 1, 0, 1] as [number, number, number, number] ,// Corrección de tipo
      },

      // Componentes en cuatro columnas
      {
        columns: [
          { width: '24%', stack: columna1, margin: [0, 0, 2, 0] as [number, number, number, number] },// Corrección de tipo
          { width: '24%', stack: columna2, margin: [2, 0, 2, 0] as [number, number, number, number] },// Corrección de tipo
          { width: '24%', stack: columna3, margin: [2, 0, 2, 0] as [number, number, number, number] },// Corrección de tipo
          { width: '24%', stack: columna4, margin: [2, 0, 0, 0] as [number, number, number, number] }// Corrección de tipo
        ]
      },

      // Pie
      {
        style: 'containerTiny',
        table: {
          widths: ['*'],
          body: [[{ text: `${props.preMarbete ? 'Impreso' : 'Liberado'}  por: ${props.usuario || ''}`, alignment: 'center', fontSize: 5 }]]
        },
        margin: [0, 1, 0, 1] as [number, number, number, number] ,// Corrección de tipo
      },

      {
        style: 'containerTiny',
        table: {
          widths: [15, '*'],
          body: [[
            { text: 'NOTA:', fillColor: '#cccccc', fontSize: 4 },
            {
              fontSize: 4,
              text: 'Por ningun motivo el usuario del sobre viajero debe de manipular los elementos ya que estos son autorizados por el cliente. Si ya terminaste de ocupar el sobre, favor de regresarlo al area responsable ya que otros procesos lo necesitan.',
              alignment: 'center'
            }
          ]]
        },
        margin: [0, 1, 0, 1] as [number, number, number, number] ,// Corrección de tipo
      }
    ],
    styles: {
      containerTiny: { fontSize: 5, margin: [0, 0.5, 0, 0.5] as [number, number, number, number] },// Corrección de tipo
      columnaContenido: { fontSize: 5, margin: [0, 0, 0, 0.5] as [number, number, number, number] }// Corrección de tipo
    },
    defaultStyle: { fontSize: 5 }
  };

  return docDefinition;
};