import { UsuarioService } from '@app/services';
import Swal from 'sweetalert2';

export type LoginFormResult = {
  username: string;
  password: string;
};
export const LoginLitoapps  = async(usuarioService:UsuarioService,title="Usuario de Litoapps que solicita los elementos") => {    
    let passwordInput: HTMLInputElement;
    const { isDismissed, value } = await Swal.fire<LoginFormResult>({
      title,
      html: `
      
      <input type="password"  autocomplete="new-password" name="pass"  id="contrasenia" class="swal2-input text-xs rounded-md" placeholder="password">
    `,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup()!;        
        passwordInput = popup.querySelector('#contrasenia') as HTMLInputElement;        
        passwordInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
      },
      preConfirm: () => {
        
        const password = passwordInput.value;
        if (!password) {
          Swal.showValidationMessage(`Por favor, ingrese la contraseña`);
        }
        return { password };
      },
    });
    if (isDismissed) {
      return { value: null, isDismissed: true };
    }
    const {  password } = value!;
    const resp = await usuarioService.loginSolicitante( password);
    if (resp.error) {
      Swal.fire({
        title: 'Error',
        text: 'Contraseña incorrecta',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return { value: null, isDismissed: true };
    }
    return { isDismissed: false, value: resp.id };
  }