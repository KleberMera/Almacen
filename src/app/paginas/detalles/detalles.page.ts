import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DetallesService } from 'src/app/servicios/detalles.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
})
export class DetallesPage implements OnInit {
  usuarioid: number = 0;
  listaDetalles: any = [];
  cliente: string = '';
  total: number = 0;
  cantidad: number = 0;
  constructor(
    private detallesService: DetallesService,
    private usuarioService: UsuarioService,
    private servG: GeneralService,
    private LoadingController: LoadingController
  ) {}

  ngOnInit() {
    //obtener el id del usuario logueado del localStorage
    const tomarid = localStorage.getItem('usuarioLogueado');
    if (tomarid != null) {
      const usuario = JSON.parse(tomarid).id;
      this.usuarioid = usuario;
      console.log('usuarioid', this.usuarioid);
    }

    this.cargarDetallesResumen();
  }

  async cargarDetallesResumen() {
    //Loading
    const loading = await this.LoadingController.create({
      message: 'Cargando detalles de pedido...',
    });
    loading.present();

    this.detallesService.detallesresumenxid(this.usuarioid).subscribe(
      (res: any) => {
        console.log('detallesresumenxid', res.data[0]);

        //listar los detalles de pedido
        this.listaDetalles = res.data;
        this.total = res.data.Total_Productos;
        console.log('listaDetalles', this.listaDetalles);
        loading.dismiss();
      }

    );

    
  }

  verDetalle(cliente: string) {
    //guardar el nombre del cliente en el localStorage
    localStorage.setItem('cliente', JSON.stringify(cliente));
    this.servG.irA('/detalle');
  }

  eliminarDetallesPedido(pedidoId: number) {
    console.log('pedidoId', pedidoId);

    const eliminarDetallesRecursivo = () => {
      this.detallesService.eliminarDetallesPedido(pedidoId).subscribe(
        (res: any) => {
          console.log('Detalles eliminados', res);
          // Verificar si aún existen detalles con el mismo pedidoId
          this.detallesService.detallesresumenxid(this.usuarioid).subscribe(
            (res: any) => {
              const detallesRestantes = res.data.filter(
                (detalle: any) => detalle.PedidoID === pedidoId
              );
              if (detallesRestantes.length === 0) {
                // No hay más detalles, eliminar el pedido
                this.detallesService.eliminarPedido(pedidoId).subscribe(
                  (res: any) => {
                    console.log('Pedido eliminado', res);
                    this.servG.fun_Mensaje('Pedido eliminado', 'success');
                    this.cargarDetallesResumen();
                  },
                  (error) => {
                    console.log('Error eliminando el pedido', error);
                  }
                );
              } else {
                console.log(
                  'Aún existen detalles con el mismo pedidoId',
                  detallesRestantes
                );
                // Llamar recursivamente hasta que no queden detalles
                eliminarDetallesRecursivo();
              }
            },
            (error) => {
              console.log('Error verificando detalles restantes', error);
            }
          );
        },
        (error) => {
          console.log('Error eliminando los detalles', error);
        }
      );
    };

    // Iniciar el proceso recursivo
    eliminarDetallesRecursivo();
  }
}
