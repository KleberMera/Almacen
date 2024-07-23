import { AlertController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  usuario: string = '';

  constructor(
    public servG: GeneralService,
    private ToastController: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    //Cargar el usuario logueado del localStorage
    const verificarUsuarioLogueado = localStorage.getItem('usuarioLogueado');
    if (verificarUsuarioLogueado != null) {
      const usuario = JSON.parse(verificarUsuarioLogueado).nombre;
      this.usuario = usuario;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    this.servG.fun_Mensaje('Sesión cerrada', 'primary');
    this.servG.irA('/login');
  }

  async confirmarSalir() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'tertiary',
          handler: () => {
            console.log('Cancelar');
          },
        },
        {
          text: 'Salir',
          handler: () => {
            this.cerrarSesion(); // Llama al método signOut si el usuario confirma salir
          },
        },
      ],
    });

    await alert.present();
  }
}
