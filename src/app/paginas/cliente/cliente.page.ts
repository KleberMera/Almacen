import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage {
  id: number = 0;
  identificacion: string = '';
  nombre: string = '';
  telefono: string = '';
  correo: string = '';
  direccion: string = '';
  pais: string = '';
  ciudad: string = '';

  //public objCliente: ICliente = ();

  constructor(
    public servC: ClienteService,
    public servG: GeneralService,
    private LoadingController: LoadingController,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['ClienteId']
      ? this.route.snapshot.params['ClienteId']
      : 0;
    console.log('El id retornado es: ' + this.id);
  }

  async ionViewDidEnter() {
    const loading = await this.LoadingController.create({
      message: 'Cargando datos...',
      spinner: 'bubbles',
      translucent: true,
    });
    loading.present();
    if (this.id > 0) {
      this.servC.getClientesxid(this.id).subscribe((res: any) => {
        console.log(res.data[0]);
        console.log('El id del cliente es: ' + this.id);
        this.identificacion = res.data[0].identificacion;
        this.nombre = res.data[0].nombre;
        this.telefono = res.data[0].telefono;
        this.correo = res.data[0].correo;
        this.direccion = res.data[0].direccion;
        this.pais = res.data[0].pais;
        this.ciudad = res.data[0].ciudad;
        loading.dismiss();
      });
    } else {
      // this.loading.dismiss();
      //this.servG.showToast('No se encontro el cliente');
      //this.servG.irA('clientes');
      loading.dismiss();
    }
  }

  async fun_grabar() {
    if (this.identificacion == '') {
      this.servG.fun_Mensaje('Debe registrar la cedula');
    } else if (this.nombre == '') {
      this.servG.fun_Mensaje('Debe registrar el nombre');
    } else {
      let l = await this.LoadingController.create({
        message: 'Registrando...',
        spinner: 'lines',
        translucent: true,
      });
      this.servC.postGrabar({
        id: this.id,
        identificacion: this.identificacion,
        nombre: this.nombre,
        telefono: this.telefono,
        correo: this.correo,
        direccion: this.direccion,
        pais: this.pais,
        ciudad: this.ciudad,
      }
    ).subscribe((res: any) => {
        //console.log(res);
        l.dismiss();
        this.servG.fun_Mensaje(res.mensaje);
        this.servG.irA('/clientes');
      },
      (err: any) => {
        console.log(err);
        this.servG.fun_Mensaje('Error al registrar el cliente');
      });
    }
  }

  
  
    
}
