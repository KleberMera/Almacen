import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { LoginService } from 'src/app/servicios/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: string = '';
  clave: string = '';
  listaUsuarios: any[] = [];
  lisraUsuarioLogueado: any[] = [];
  id: number = 0;

  constructor(
    public srvG: GeneralService,
    private srvL: LoginService,
    private loading: LoadingController,
    private LoadingController: LoadingController
  ) {}

  ngOnInit() {
    console.log('LoginPage');
    //Ver usuario que esta logueado
  }

  async iniciarSesion() {
    const loading = await this.LoadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'bubbles',
    });
    loading.present();
    
    if (this.usuario == '') {
      this.srvG.fun_Mensaje('Debe ingresar el usuario', 'danger');
    } else if (this.clave == '') {
      this.srvG.fun_Mensaje('Debe ingresar la clave', 'danger');
    } else {
      this.srvL
        .login({
          usuario: this.usuario,
          clave: this.clave,
        })
        .subscribe((respuesta: any) => {
          if (respuesta.retorno == '1') {
            this.srvG.fun_Mensaje(respuesta.mensaje, 'primary');
            //Tomar los datos del usuario logueado y guardarlos en localStorage
            console.log(respuesta);
            
            const id = respuesta.id;
            const nombreUsuario = respuesta.usuario;
            //mandar en json el usuario logueado
            const usuarioLogueado = {
              usuario: this.usuario,
              clave: this.clave,
              id: id,
              nombre: nombreUsuario,
            };
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
            
            

            this.srvG.irA('/principal');
            loading.dismiss();
          } else {
            //  this.srvG.fun_Mensaje('Error al iniciar sesión');
            this.srvG.fun_Mensaje(respuesta.mensaje, 'danger');
            loading.dismiss();
          }
        });
    }
  }
}
