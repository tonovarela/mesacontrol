import { computed, Injectable, signal } from '@angular/core';
import { Drawer, DrawerInterface, InstanceOptions } from 'flowbite';
import swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  
  constructor() { }

  
  toggleSidebar() {    
  }

  
  mostrarAlertaError(titulo:string, mensaje:string) {
    swal.fire(titulo, mensaje, 'error');
  }



  mostrarAlertaErrorAutoClose(titulo:string, mensaje:string, timer = 1000) {
    swal.fire({
      title: titulo,
      showConfirmButton: false,
      text: mensaje,
      icon: 'error',
      timer: timer
    });
  }


  mostrarLoading() {
    swal.fire({
      title: 'Procesando',
      html: '...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        swal.showLoading()
      }
    });
  }
  ocultarLoading(mensaje: string) {
    swal.fire({
      title: 'Listo',
      html: mensaje,
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    swal.hideLoading();
  }

  mostrarAlertaConfirmacion(titulo:string, mensaje:string, labelAceptar = 'Aceptar', labelCancelar = 'Cancelar'): Promise<SweetAlertResult> {
    return swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: labelAceptar,
      cancelButtonText: labelCancelar,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    });

  }

  mostrarAlertaSuccess(titulo:string, mensaje:string, timer = 3500) {
    swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje,
      showConfirmButton: false,
      timer
    });

  }

}
