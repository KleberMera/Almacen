import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { IProducto } from 'src/app/interfaces/intefaces';
import { GeneralService } from 'src/app/servicios/general.service';
import { ProductosService } from 'src/app/servicios/producto.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  listaProductos: any[] = [];
  filteredProductos: any[] = [];
  searchTerm: string = '';
  listadecarrito: IProducto[] = [];

  constructor(
    public servG: GeneralService,
    private servP: ProductosService,
    private loading: LoadingController
  ) {}

  ngOnInit() {
    console.log('Se cargaron los productos');
  }

  ionViewWillEnter() {
    this.cargarProductos();
  }

  async cargarProductos() {
    let l = await this.loading.create({
      message: 'Cargando productos...',
      spinner: 'bubbles',
    });
    l.present();

    this.servP.getproductos().subscribe(
      (respuesta: any) => {
        this.listaProductos = respuesta.data.map((producto: IProducto) => {
          return { ...producto, agregado: false }; // Inicializar la propiedad "agregado"
        });
        this.filteredProductos = this.listaProductos;
        console.log(this.listaProductos);

        l.dismiss();
      },
      (error: any) => {
        this.listaProductos = [];
        this.filteredProductos = [];
        l.dismiss();
        this.servG.fun_Mensaje('Error al cargar los productos');
      }
    );
  }

  fun_editarProducto(producto: any, ionItemSlinding: IonItemSliding) {
    ionItemSlinding.close();
    this.servG.irA('/producto/' + producto.id);
  }

  fun_eliminarProducto(producto: any, ionItemSlinding: IonItemSliding) {
    ionItemSlinding.close();
    this.servP.eliminarProductos(producto.id).subscribe(
      (res: any) => {
        this.cargarProductos();
        this.servG.fun_Mensaje(res.mensaje, 'primary');
      },
      (error: any) => {
        this.servG.fun_Mensaje('Error al eliminar el producto');
      }
    );
  }

  getImageUrl(producto: IProducto): string {
    if (producto.imagen != null) {
      return producto.imagen;
    } else {
      //<ion-icon name="cart-outline"></ion-icon>
      return 'assets/imagenes/cart.svg';
    }
  }

  agregarAlCarrito(producto: IProducto) {
    if (!producto.agregado) {
      producto.agregado = true; // Actualizar la propiedad "agregado"
      this.listadecarrito.push(producto);
      //Guardar en localStorage los productos del carrito
      const productosdelcarrito = this.listadecarrito;
      localStorage.setItem(
        'productosdelcarrito',
        JSON.stringify(productosdelcarrito)
      );
      console.log('Producto agregado al carrito:', producto);
      this.servG.fun_Mensaje('Producto agregado al carrito', 'primary');
    }
  }

  productoValido(producto: IProducto): boolean {
    return producto.precio > 0 && producto.stock > 0 && producto.activo != null;
  }

  
  getButtonColor(producto: IProducto): string {
    if (producto.stock <= 0) {
      return 'danger';
    } else if (!producto.activo) {
      return 'warning';
    }else if (producto.agregado) {
      return 'success';
    }
    return 'primary';
  }

  getButtonText(producto: IProducto): string {
    if (producto.agregado) {
      return 'Agregado';
    } else if (producto.stock <= 0) {
      return 'Stock agotado';
    } else if (!producto.activo) {
      return 'No activado';
    }
    return 'Agregar';
  }
}
