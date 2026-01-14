type ColumnaConfig = {
  indice: number;
  titulo: string;
  subtitulo: string;
  color: string;
  fechaKey: string;
  estadoKey: string;
  checklistKey: string;
  estadoExtra?: string; // Para casos donde se requiere validar id_estado == "1"
};

const columnasConfig: ColumnaConfig[] = [
  {
    indice: 1,
    titulo: 'Liberacion al Cliente',
    subtitulo: 'Prueba de color',
    color: 'text-blue-600',
    fechaKey: 'clientePruebaColor_fechaLiberacion',
    estadoKey: 'clientePruebaColor_idEstado',
    checklistKey: 'clientePruebaColor_checklist'
  },
  {
    indice: 2,
    titulo: 'Liberacion al Cliente',
    subtitulo: 'Dummy vestido',
    color: 'text-blue-600',
    fechaKey: 'cliente_dummyVestido_fechaLiberacion',
    estadoKey: 'clienteDummyVestido_idEstado',
    checklistKey: 'clienteDummyVestido_checklist'
  },
  {
    indice: 3,
    titulo: 'Liberacion sobre viajero',
    subtitulo: 'Prueba de color',
    color: 'text-pink-600',
    fechaKey: 'viajeroPruebaColor_fechaLiberacion',
    estadoKey: 'viajeroPruebaColor_idEstado',
    checklistKey: 'viajeroPruebaColor_checkList',
    estadoExtra: '1'
  },
  {
    indice: 4,
    titulo: 'Liberación sobre viajero',
    subtitulo: 'Dummy blanco',
    color: 'text-pink-600',
    fechaKey: 'viajeroDummyBlanco_fechaLiberacion',
    estadoKey: 'viajeroDummyBlanco_idEstado',
    checklistKey: 'viajeroDummyBlanco_checkList',
    estadoExtra: '1'
  },
  {
    indice: 5,
    titulo: 'Liberación sobre viajero',
    subtitulo: 'Dummy vestido',
    color: 'text-pink-600',
    fechaKey: 'viajeroDummyVestido_fechaLiberacion',
    estadoKey: 'viajeroDummyVestido_idEstado',
    checklistKey: 'viajeroDummyVestido_checkList',
    estadoExtra: '1'
  },
  {
    indice: 6,
    titulo: 'Liberación sobre viajero',
    subtitulo: 'Liberación',
    color: 'text-pink-600',
    fechaKey: 'viajeroLiberacion_fechaLiberacion',
    estadoKey: 'viajeroLiberacion_idEstado',
    checklistKey: 'viajeroLiberacion_checkList',
    estadoExtra: '1'
  }
];

function  puedeVerHistorico(estadoKey:string){
 return estadoKey=="1" || estadoKey=="2"
}


// Función utilitaria para colorImagen
function getColorImagen(data: any, estadoKey: string, checklistKey: string, estadoExtra?: string) {
  const estado = data[estadoKey];
  if (estado == "2") return 'fill-white py-1 rounded-full bg-lime-700';
  if (estado == "3") return 'fill-white py-1 rounded-full bg-pink-600';
  if (estado == "4") return 'fill-white py-1 rounded-full bg-gray-400';
  if (
    data.id_checklist_actual === data[checklistKey] &&
    (estadoExtra ? data.id_estado == estadoExtra : true)
  ) {
    return 'fill-white py-1 rounded-full bg-purple-600';
  }
  return 'fill-gray-400';
}

// Función utilitaria para check
function getCheck(data: any, checklistKey: string) {
  if (!data[checklistKey]) return false;
  return data.id_checklist_actual === data[checklistKey];
}

// Generar el arreglo final de columnas
export const columnas = columnasConfig.map(col => ({
  indice: col.indice,
  titulo: col.titulo,
  subtitulo: col.subtitulo,
  color: col.color,
  getCheckListKey:(data:any)=> data[col.checklistKey],
  //sePuedeVerHistorico:(data:any)=> puedeVerHistorico(data[col.estadoKey]),
  obtenerFechaLiberacion: (data: any) => data[col.fechaKey],
  obtenerEstado: (data: any) => data[col.estadoKey],

  colorImagen: (data: any) => getColorImagen(data, col.estadoKey, col.checklistKey, col.estadoExtra),
  check: (data: any) => getCheck(data, col.checklistKey)
}));
