import { UsuarioService } from '@app/services';
import Swal from 'sweetalert2';

export type LoginFormResult = {
  username: string;
  password: string;
};
export const LoginLitoapps  = async(usuarioService:UsuarioService) => {
    let usernameInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    const { isDismissed, value } = await Swal.fire<LoginFormResult>({
      title: 'Usuario de Litoapps que solicita los elementos',
      html: `
      <input type="text"  autocomplete="off"  id="usuario" name="usuario" class="swal2-input rounded-md" placeholder="usuario">
      <input type="password"  autocomplete="new-password" name="pass"  id="contrasenia" class="swal2-input rounded-md" placeholder="password">
    `,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup()!;
        usernameInput = popup.querySelector('#usuario') as HTMLInputElement;
        passwordInput = popup.querySelector('#contrasenia') as HTMLInputElement;
        usernameInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
        passwordInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
      },
      preConfirm: () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (!username || !password) {
          Swal.showValidationMessage(`Por favor, ingrese ambos campos`);
        }
        return { username, password };
      },
    });
    if (isDismissed) {
      return { value: null, isDismissed: true };
    }
    const { username, password } = value!;
    const resp = await usuarioService.loginSolicitante(username, password);
    if (resp.error) {
      Swal.fire({
        title: 'Error',
        text: 'Usuario o contraseña incorrectos',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return { value: null, isDismissed: true };
    }
    return { isDismissed: false, value: resp.id };
  }