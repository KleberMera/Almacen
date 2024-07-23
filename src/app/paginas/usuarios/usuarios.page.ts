import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  constructor(
    public srvG: GeneralService,
    private srvU: UsuarioService,
    private LoadingController: LoadingController
  ) {}

  /* {
    "id": "1",
    "usuario": "usuario1",
    "clave": "14e1b600b1fd579f47433b88e8d85291",
    "nombre": "Jimmy Castellanos",
    "telefono": "444444",
    "correo": "micorreo@dominio.com",
    "activo": "1"
},*/

  listaUsuarios: any[] = [];

  ngOnInit() {
    console.log('UsuariosPage');

    
  }

  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    //Loading
    const loading = await this.LoadingController.create({
      message: 'Cargando usuarios...',
      spinner: 'bubbles',
    });
    loading.present();
    this.srvU.getUsuarios().subscribe(
      (respuesta: any) => {
        console.log(respuesta);
        this.listaUsuarios = respuesta.data;
        console.log(this.listaUsuarios);
        loading.dismiss();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  fun_editarUsuario(usuario: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    
    this.srvG.irA('/usuario/' + usuario.id);
   
  }

  fun_eliminarUsuario(usuario: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.srvU.eliminarUsuarios(usuario.id).subscribe(
      (res: any) => {
        this.cargarUsuarios();
        this.srvG.fun_Mensaje(res.mensaje, 'primary');
      },
      (error: any) => {
        this.srvG.fun_Mensaje('Error al eliminar el usuario');
      }
    );
  }
}
