import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

import { GeneralService } from 'src/app/servicios/general.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage {
  id: number = 0;
  usuario: string = '';
  clave: string = '';
  nombre: string = '';
  telefono: string = '';
  correo: string = '';
  activo: boolean = true;

  constructor(
    private srvU: UsuarioService,
    public servG: GeneralService,
    private LoadingController: LoadingController,
    private route: ActivatedRoute,
    private ToastController: ToastController
  ) {
    this.id = this.route.snapshot.params['usuarioId']
      ? this.route.snapshot.params['usuarioId']
      : 0;
    console.log('El id retornado es: ' + this.id);
  }

  async ionViewWillEnter() {
    const loading = await this.LoadingController.create({
      message: 'Cargando Datos...',
      spinner: 'bubbles',
    });
    loading.present();
    if (this.id > 0) {
      this.srvU.getUsuariosxid(this.id).subscribe((res: any) => {
        console.log(res.data[0]);
        console.log('El id del usuario es: ' + this.id);
        this.usuario = res.data[0].usuario;
        this.clave = res.data[0].clave;
        this.nombre = res.data[0].nombre;
        this.telefono = res.data[0].telefono;
        this.correo = res.data[0].correo;
        this.activo = res.data[0].activo;
        loading.dismiss();
      });
    } else {
      //this.servG.fun_Mensaje("No se encontro el usuario");
      //this.servG.irA("/usuarios");
      loading.dismiss();
      const loadinga = await this.LoadingController.create({
        message: 'Nuevo Usuario',
        spinner: 'bubbles',
      });
      loadinga.present();
      loadinga.dismiss();
    }
  }

  async fun_grabar() {
    if (this.usuario == '') {
      this.mensaje('Debe registrar el usuario', 'danger');
    } else if (this.clave == '') {
      this.mensaje('Debe registrar la clave', 'danger');
    } else {
      const loading = await this.LoadingController.create({
        message: 'Registrando Usuario',
        spinner: 'bubbles',
      });
      loading.present();
      this.srvU
        .postGrabarUsuarios({
          id: this.id,
          usuario: this.usuario,
          clave: this.clave,
          nombre: this.nombre,
          telefono: this.telefono,
          correo: this.correo,
          activo: this.activo ? 1 : 0,
        })
        .subscribe(
          (res: any) => {
            loading.dismiss();
            
            this.mensaje(res.mensaje, 'primary');
            //Verificar si hay usuario logueado en localStorage
            if (localStorage.getItem('usuarioLogueado')!= null) {
              this.servG.irA('/usuarios');
            }else{
              
             
              this.servG.irA('/login');
            }
            
          },
          (err: any) => {
            console.log(err);
            this.servG.fun_Mensaje('Error al registrar el usuario');
          }
        );
    }
  }

  async mensaje(texto: string, tipo: string = '') {
    let t = await this.ToastController.create({
      message: texto,
      color: tipo,
      duration: 3000,
    });
    t.present();
  }
}
