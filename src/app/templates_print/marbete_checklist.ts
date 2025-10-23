
import { ComponenteSobre } from "@app/interfaces/responses/ResponseOrdenMetrics";
import { TDocumentDefinitions } from "pdfmake/interfaces";


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
          [
            {
            text: componente.componente || 'Componente',
            fillColor: '#e6e6e6',
            bold: true,            
            alignment: 'center',
            fontSize: 8
          }, 
        ],
          ...elementos.map((elemento: string) => [            
            { text: elemento, fontSize: 6 , alignment: 'center'}

          ],
        ),


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
    pageMargins: [8, 90, 5, 42],
    content: [      
      // Título del contenido
      {
        style: 'containerTiny',
        layout:   'noBorders',
        table: {
          
          widths: ['*'],
          body: [[{ text: 'CONTENIDO DEL SOBRE', bold: true, alignment: 'center', fontSize: 8 }]]
        },
        margin: [0, 0, 0, 0] as [number, number, number, number] ,// Corrección de tipo
      },      
      {
        columns: [
          { width: '23%', stack: columna1, margin: [0, 0, 2, 0] as [number, number, number, number] },// Corrección de tipo
          { width: '23%', stack: columna2, margin: [2, 0, 2, 0] as [number, number, number, number] },// Corrección de tipo
          { width: '23%', stack: columna3, margin: [2, 0, 2, 0] as [number, number, number, number] },// Corrección de tipo
          { width: '23%', stack: columna4, margin: [2, 0, 0, 0] as [number, number, number, number] }// Corrección de tipo
        ]
      },      
    ],
    styles: {
      containerTiny: { fontSize: 8, margin: [0, 0.5, 0, 0.5] as [number, number, number, number] },// Corrección de tipo
      columnaContenido: { fontSize: 8, margin: [0, 0, 0, 0.5] as [number, number, number, number] }// Corrección de tipo
    },
 header: function(currentPage, pageCount, pageSize) {    
    return [
        {
        columns: [          
          { width: '*', text: 'LIBERADO POR MESA DE CONTROL', fontSize: 10, alignment: 'center', margin: [0, 10, 0, 0] }
        ]
      },      
      {
        style: 'containerTiny',
        layout :'noBorders',
        table: {
          widths: ['*', '*','*'],
          body: [
            [
              { text: `OP: ${props.numero_orden}`,bold:true, fontSize: 8 },
              { text: `Fecha: ${formatedDate}`, bold:true, fontSize: 8 },              
              { text: `Página  ${currentPage} de ${pageCount} `,bold:true, fontSize: 6,alignment:'right' }
            ]
          ]
        },
        margin: [10, 0, 10, 0] as [number, number, number, number] ,// Corrección de tipo
      },

      {
        style: 'containerTiny',
        table: {
          widths: [40, '*'],
          body: [
            [{ text: `Nombre:`, fillColor: '#cccccc', fontSize: 8,bold:true }, { text: `${props.nombre_trabajo || ''}`, fontSize: 7 }],
            [{ text: `Cliente:`, fillColor: '#cccccc', fontSize: 8,bold:true }, { text: `${props.cliente || ''}`, fontSize: 7 }],
            [{ text: `Vendedor:`, fillColor: '#cccccc', fontSize: 8,bold:true }, { text: `${(props.vendedor || '').toUpperCase()}`, fontSize: 7 }]
          ]
        },
        margin: [10, 0, 10, 0] as [number, number, number, number] ,// Corrección de tipo
      },
    ]
  },
    footer: function(currentPage, pageCount) { 
     const body =
      (currentPage === pageCount)?     
     [
      {
        style: 'containerTiny',
        layout: 'noBorders',
        table: {
          widths: ['*'],
          body: [[
            { text: `${props.preMarbete ? 'Impreso' : 'Liberado'}  por: ${props.usuario || ''}`, alignment: 'center', fontSize: 8 },            
          ]]
        },
        margin: [10, 0, 10, 0] as [number, number, number, number] ,// Corrección de tipo
      },
      {
        style: 'containerTiny',

        table: {
          widths: [40
            , '*'],
          body: [[
            { text: 'NOTA:', fillColor: '#cccccc', fontSize: 10 },
            {
              fontSize: 6,
              text: 'Por ningun motivo el usuario del sobre viajero debe de manipular los elementos ya que estos son autorizados por el cliente. Si ya terminaste de ocupar el sobre, favor de regresarlo al area responsable ya que otros procesos lo necesitan.',
              alignment: 'center'
            }
          ]]
        },
        margin: [10, 0, 10,0] as [number, number, number, number] ,// Corrección de tipo
      }    
    ]:[];
      return body;
  
  
      
     },
    defaultStyle: { fontSize: 8}
  };

  return docDefinition;
};