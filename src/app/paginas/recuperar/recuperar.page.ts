import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { RecuperarService } from 'src/app/servicios/recuperar.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  usuario: string = '';
  clave: string = '';

  constructor(
    private srvR: RecuperarService,
    public servG: GeneralService,
    private ToastController: ToastController
  ) { }

  ngOnInit() {
    console.log('Se ha cargado la pagina recuperar');
    
  }

  reestablecer() {
    if (this.usuario == '') {
      this.mensaje('Debe ingresar el usuario', 'danger');
    } else if (this.clave == '') {
      this.mensaje('Debe ingresar la clave', 'danger');
    } else {
      this.srvR.reestablecer({
        usuario: this.usuario,
        clave: this.clave,
      }).subscribe(
        (res: any) => {
          if(res.retorno== '1'){
            this.mensaje(res.mensaje, 'primary');
            this.servG.irA('/login');
          }else{
            this.mensaje(res.mensaje, 'danger');
          }
          
        },
        (err: any) => {
          console.log(err);
          //this.servG.fun_Mensaje('Error al registrar el usuario');
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
