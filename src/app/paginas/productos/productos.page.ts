import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { IProducto } from 'src/app/interfaces/intefaces';

import { GeneralService } from 'src/app/servicios/general.service';
import { ProductosService } from 'src/app/servicios/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage {
  listaProductos: any[] = [];
  filteredProductos: any[] = [];
  searchTerm: string = '';

  constructor(
    private servP: ProductosService,
    public servG: GeneralService,
    private loading: LoadingController
  ) {}

  ionViewWillEnter() {
    this.cargarProductos();
  }

  async cargarProductos() {
    let l = await this.loading.create(
      {
        message: 'Cargando productos...',
        spinner: 'bubbles',
        animated: true,
      }
    );
    l.present();

    this.servP.getproductos().subscribe(
      (respuesta: any) => {
        this.listaProductos = respuesta.data;
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

  filterProductos(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredProductos = this.listaProductos.filter((producto) => {
      return producto.nombre.toLowerCase().includes(searchTerm);
    });
  }

  fun_editarProducto(producto: any, ionItemSlinding: IonItemSliding) {
    ionItemSlinding.close();
    this.servG.irA('/producto/' + producto.id);
  }

  fun_eliminarProducto(producto: any, ionItemSlinding: IonItemSliding) {
    ionItemSlinding.close();
    this.servP.eliminarProductos(producto.id).subscribe((res: any) => {
      this.cargarProductos();
      this.servG.fun_Mensaje(res.mensaje ,'primary');
    }, (error: any) => {
      this.servG.fun_Mensaje('Error al eliminar el producto');
    });
  }

  getImageUrl(producto: IProducto): string {
    if (producto.imagen != null) {
      return producto.imagen;
      
    } else {
      //<ion-icon name="cart-outline"></ion-icon>
      return 'assets/imagenes/image-outline.svg';
    }
    
  }

  
}
