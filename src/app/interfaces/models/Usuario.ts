export type Usuario ={
    id: number;
    nombre: string;
    login:string;
    id_rol:number;
    personal?:string;
    puesto?:string;
    
}

  
  export enum StatutLogin {
    LOGIN ="LOGIN",
    LOGOUT="LOGOUT",
    ERROR="ERROR",
    LOADING="LOADING"
  }


export  interface StatusSesion {
    usuario?:Usuario;
    estatus:StatutLogin
  }