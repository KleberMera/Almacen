import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DetallesService } from 'src/app/servicios/detalles.service';

import { GeneralService } from 'src/app/servicios/general.service';
import { IProducto } from 'src/app/interfaces/intefaces';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  usuarioid: number = 0;
  cliente: string = '';
  listadetalles: any = [];
  PedidoDetalleID: number = 0;
  pedidos: any[] = [];
  selectedPedidoID: number | null = null;
  imagen: string = '';

  constructor(
    private servG: GeneralService,
    private detalleService: DetallesService,
    private LoadingController: LoadingController
  ) {}

  ngOnInit() {
    //obtener el id del usuario logueado del localStorage
    const tomarid = localStorage.getItem('usuarioLogueado');
    if (tomarid != null) {
      const usuario = JSON.parse(tomarid).id;
      console.log('usuario', usuario);
      this.usuarioid = usuario;
    }

    //obtener el nombre del cliente del localStorage
    const tomarcliente = localStorage.getItem('cliente');
    if (tomarcliente != null) {
      const cliente = JSON.parse(tomarcliente);
      console.log('cliente', cliente);
      this.cliente = cliente;
    }

    this.cargarDetalles();
    this.cargarPedidos();

    
   
  }

  cargarPedidos() {
    this.detalleService.obtenerPedidos(this.usuarioid, this.cliente).subscribe(
      (res: any) => {
        this.pedidos = res.data;
        console.log('pedidos', this.pedidos);
        if (this.pedidos.length > 0) {
          this.selectedPedidoID = null; // Limpiar la selección inicial
        }
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  async cargarDetallesPorPedidoID() {
    //Loading
    const loading = await this.LoadingController.create({
      message: 'Cargando detalles...',
    });
    loading.present();
    if (this.selectedPedidoID != null) {
      this.detalleService
        .detallesPor_IdPedido_Nombre_IDusuario(
          this.selectedPedidoID,
          this.cliente,
          this.usuarioid
        )
        .subscribe(
          (res: any) => {
            this.listadetalles = res.data;
           
            console.log('detalles por pedido', res);
           
            
            loading.dismiss();
          },
          (error: any) => {
            console.log('error', error);
          }
        );
    } else {
      console.log('cargarDetalles');

      this.cargarDetalles();
    }
  }

  async cargarDetalles() {
    //Loading
    const loading = await this.LoadingController.create({
      message: 'Cargando detalles...',
    });
    loading.present();
    this.detalleService
      .detallescompletos(this.usuarioid, this.cliente)
      .subscribe(
        (res: any) => {
          this.listadetalles = res.data;
          console.log('detallescompletos', this.listadetalles);
          
          
          
          
          
          

          loading.dismiss();
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  fun_eliminarDetalle(detalleID: number) {
    this.detalleService.borrarDetalle(detalleID).subscribe((res: any) => {
      console.log('borrarDetalle', res.data);
      this.cargarDetalles();
      this.servG.fun_Mensaje(res.mensaje, 'primary');
    });
  }

  

 
}
