import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IProducto, IProducto2 } from 'src/app/interfaces/intefaces';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { PedidosService } from 'src/app/servicios/pedidos.service';
import { ProductosService } from 'src/app/servicios/producto.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {
  id: number = 0;
  carrito: IProducto2[] = [];
  usuario: string = '';
  listaClientesNombres: any[] = [];

  idCliente: number = 0;
  identificacion: string = '';
  nombre: string = '';
  telefono: string = '';
  correo: string = '';
  direccion: string = '';
  pais: string = '';
  ciudad: string = '';

  idUsuario: number = 0;

  estado: number = 1;
  constructor(
    private servC: ClienteService,
    public servG: GeneralService,
    public servPedidos: PedidosService,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {
    this.id = this.route.snapshot.params['productosId']
      ? this.route.snapshot.params['productosId']
      : 0;
    console.log('El id retornado es: ' + this.id);
  }

  ngOnInit() {
    this.servC.getClientesTodoslosnombres().subscribe(
      (res: any) => {
        this.listaClientesNombres = res.data;
        console.log('Lista de clientes: ', this.listaClientesNombres);
      },
      (error: any) => {
        this.servG.fun_Mensaje('Error al cargar los clientes');
      }
    );
    //Cargar el carrito del localStorage
    const carrito = localStorage.getItem('productosdelcarrito');
    if (carrito != null) {
      this.carrito = JSON.parse(carrito).map((producto: IProducto2) => {
        producto.cantidad = 1; // Inicializar cantidad a 1
        return producto;
      });
      console.log('Carrito carrito: ', this.carrito);
    }

    //Cargar el usuario logueado del localStorage
    const verificarUsuarioLogueado = localStorage.getItem('usuarioLogueado');
    if (verificarUsuarioLogueado != null) {
      const usuario = JSON.parse(verificarUsuarioLogueado).nombre;
      const id = JSON.parse(verificarUsuarioLogueado).id;
      this.usuario = usuario;
      this.idUsuario = id;
    }

    //Si la imagen del producto no existe, se carga el icono de cart
    this.carrito.forEach((producto: IProducto) => {
      if (producto.imagen == null || producto.imagen == '') {
        producto.imagen = 'assets/imagenes/cart.svg';
      }
    });
  }

  onClienteChange(event: any) {
    const nombre = event.detail.value;
    this.servC.getClientexnombre(nombre).subscribe(
      (res: any) => {
        if (res.cantidad > 0) {
          this.idCliente = res.data[0].id;
          console.log('ID del cliente seleccionado: ', this.idCliente);
          // Guardar el ID del cliente seleccionado en el localStorage
          localStorage.setItem(
            'clienteSeleccionado',
            JSON.stringify(this.idCliente)
          );
        }
      },
      (error: any) => {
        this.servG.fun_Mensaje('Error al obtener el ID del cliente');
      }
    );
  }

  removeProduct(index: number) {
    this.carrito.splice(index, 1);
    localStorage.setItem('productosdelcarrito', JSON.stringify(this.carrito));
    this.servG.fun_Mensaje('Producto eliminado del carrito', 'primary');
  }

  decreaseQuantity(index: number) {
    if (this.carrito[index].cantidad > 1) {
      this.carrito[index].cantidad--;
    }
    this.validateStock(index);
    localStorage.setItem('productosdelcarrito', JSON.stringify(this.carrito));
  }

  increaseQuantity(index: number) {
    if (this.carrito[index].cantidad < this.carrito[index].stock) {
      this.carrito[index].cantidad++;
    } else {
      this.servG.fun_Mensaje(
        'No puedes agregar más productos de los que hay en stock.', 'danger'
      );
    }
    localStorage.setItem('productosdelcarrito', JSON.stringify(this.carrito));
  }

  validateStock(index: number) {
    if (this.carrito[index].cantidad > this.carrito[index].stock) {
      this.carrito[index].cantidad = this.carrito[index].stock;
      this.servG.fun_Mensaje(
        'No puedes agregar más productos de los que hay en stock.', 'danger'
      );
    }
    localStorage.setItem('productosdelcarrito', JSON.stringify(this.carrito));
  }

  async fun_grabar() {
   
    const pedido = {
      cliente_id: this.idCliente,
      usuario_id: this.idUsuario,
      fecha: this.formatDateForMySQL(new Date()),
      estado: this.estado,
    };
   

    console.log('Pedido: ', pedido);
    const loading = await this.loadingCtrl.create({
      message: 'Registrando pedido...',
      spinner: 'bubbles',
    });
    loading.present()
    

    this.servPedidos.insertarPedido(pedido).subscribe(
      (response: any) => {
        if (response.id) {
          const pedidoId = response.id;
          const detallesPedido = this.carrito.map((producto) => ({
            producto_id: producto.id,
            pedido_id: pedidoId,
            cantidad: producto.cantidad,
          }));
          ;

          this.guardarDetallesPedido(detallesPedido);
        } else {
          this.servG.fun_Mensaje(response.mensaje, 'primary');
          console.log(response);
          
        }
        loading.dismiss();
      },
      (error: any) => {
        this.servG.fun_Mensaje('Error al guardar el pedido.');
        console.error(error);
      }
    );
  }
  private formatDateForMySQL(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  guardarDetallesPedido(detallesPedido: any[]) {
    detallesPedido.forEach((detalle) => {
      this.servPedidos.insertarDetalle(detalle).subscribe(
        (response: any) => {
          if (response.id) {
            this.servG.fun_Mensaje(response.mensaje);
            //borrar todo del carrito

            localStorage.removeItem('productosdelcarrito');
            //borrar el cliente seleccionado
            localStorage.removeItem('clienteSeleccionado');
            //ir a la pagina de pedidos
            this.servG.irA('/principal');
          } else {
            this.servG.fun_Mensaje(
              'Hubo un problema al guardar los detalles del pedido.'
            );
          }
        },
        (error: any) => {
          this.servG.fun_Mensaje('Error al guardar los detalles del pedido.');
          console.error(error);
        }
      );
    });
  }
}
