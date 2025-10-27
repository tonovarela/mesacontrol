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
   //fecha_liberacion:(string | null)[]

}

export const cuerpoMarbete = (props: MarbeteProps): TDocumentDefinitions => {
  // Asegurarse que contenidoSobre existe
  const componentes = props.contenidoSobre || [];  
  
  const { columna1, columna2, columna3, columna4 } = obtenerDistribucionColumnas(componentes);

  const date = new Date();
  const formatedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} `;

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A6',
    pageOrientation: 'landscape',    
    pageMargins: [12, 90, 5, 42],
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




export const cuerpoSobre = (props: MarbeteProps): TDocumentDefinitions => {
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
            fontSize: 6
          }, 
        ],
          ...elementos.map((elemento: string) => [            
            { text: elemento, fontSize: 6, alignment: 'start'}

          ],
        ),


        ]
      }
    };
  });

  // Dividir las tablas en cuatro columnas
  // Distribuir las tablas en cuatro columnas intentando balancear la altura (greedy bin-packing)
  const columns: any[][] = [[], [], []];
  const heights: number[] = [0, 0, 0];

  // Crear una lista de índices y tamaños (número de filas) para cada tabla
  const tablasConAltura = tablasComponentes.map((tabla, i) => {
    const filas = (tabla && tabla.table && Array.isArray((tabla.table as any).body)) ? (tabla.table as any).body.length : 1;
    return { tabla, index: i, filas };
  });

  // Ordenar descendentemente por filas para colocar primero las tablas más altas
  tablasConAltura.sort((a, b) => b.filas - a.filas);

  // Colocar cada tabla en la columna con menor altura acumulada
  tablasConAltura.forEach(item => {
    const minCol = heights.indexOf(Math.min(...heights));
    columns[minCol].push(item.tabla);
    heights[minCol] += item.filas;
  });

  const columna1 = columns[0];
  const columna2 = columns[1];
  const columna3 = columns[2];
  
  

  const date = new Date();
  const formatedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} `;

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A6',
    pageOrientation: 'portrait',    
    pageMargins: [12, 15, 5, 0],
    content: [      
       {
        columns: [          
          { width: '*', text: 'SOBRETECA', fontSize: 10, alignment: 'center', margin: [0, 5, 0, 0] }
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
          { width: '33%', stack: columna1, margin: [0, 0, 2, 0] as [number, number, number, number] },// Corrección de tipo
          { width: '33%', stack: columna2, margin: [2, 0, 2, 0] as [number, number, number, number] },// Corrección de tipo
          { width: '33%', stack: columna3, margin: [2, 0, 2, 0] as [number, number, number, number] },// Corrección de tipo          
        ]
      },      
    ],
    styles: {
      containerTiny: { fontSize: 8, margin: [0, 0.1, 0, 0.1] as [number, number, number, number] },// Corrección de tipo
      columnaContenido: { fontSize: 8, margin: [0, 0, 0, 0.5] as [number, number, number, number] }// Corrección de tipo
    },
 header: function(currentPage, pageCount, pageSize) {      
    return [{
      
      columns:[         
          { text: `OP  ${props.numero_orden} `,bold:true, fontSize: 6,alignment:'left' },
          { text: `Página  ${currentPage} de ${pageCount} `,bold:true, fontSize: 6,alignment:'right' },          
      ]   ,
      margin: [10, 5, 10, 0],    
    }];
  
    
  },
  
    defaultStyle: { fontSize: 8}
  };

  return docDefinition;
};






 const obtenerDistribucionColumnas = (componentes:ComponenteSobre[]) => {

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
  // Distribuir las tablas en cuatro columnas intentando balancear la altura (greedy bin-packing)
  const columns: any[][] = [[], [], [], []];
  const heights: number[] = [0, 0, 0, 0];

  // Crear una lista de índices y tamaños (número de filas) para cada tabla
  const tablasConAltura = tablasComponentes.map((tabla, i) => {
    const filas = (tabla && tabla.table && Array.isArray((tabla.table as any).body)) ? (tabla.table as any).body.length : 1;
    return { tabla, index: i, filas };
  });

  // Ordenar descendentemente por filas para colocar primero las tablas más altas
  tablasConAltura.sort((a, b) => b.filas - a.filas);

  // Colocar cada tabla en la columna con menor altura acumulada
  tablasConAltura.forEach(item => {
    const minCol = heights.indexOf(Math.min(...heights));
    columns[minCol].push(item.tabla);
    heights[minCol] += item.filas;
  });

  const columna1 = columns[0];
  const columna2 = columns[1];
  const columna3 = columns[2];
  const columna4 = columns[3];

  return {columna1, columna2, columna3, columna4};
  
  
  
}


