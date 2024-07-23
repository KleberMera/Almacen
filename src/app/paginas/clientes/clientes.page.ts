import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  listarClientes: any[] = [];

  constructor(
    public servC: ClienteService,
    public servG: GeneralService,
    private loading: LoadingController
  ) {}

  ngOnInit() {
    console.log('Clientes');
  }

  ionViewDidEnter() {
    this.cargarClientes();
  }

  async cargarClientes() {
    let l =await this.loading.create({
      message: 'Cargando clientes...',
      duration: 10000,
    });   
    l.present();
    this.servC.getClientes().subscribe(
      res => {
        this.listarClientes = res.data;
        l.dismiss();

        console.log(this.listarClientes);
      }, (error: any) => {
        //console.log(error);
        this.listarClientes = [];
        l.dismiss();
        this.servG.fun_Mensaje('Error al cargar clientes');
      }
  );
  }

  fun_eliminarCliente(cliente: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.servC.eliminarClientes(cliente.id).subscribe((res: any) => {
      this.cargarClientes();
      this.servG.fun_Mensaje(res.mensaje ,'primary');
    }, (error: any) => {
      this.servG.fun_Mensaje('Error al eliminar el cliente');
    }); 
    
  }

  fun_editarCliente(cliente: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.servG.irA('cliente/' + cliente.id);
  }
}
