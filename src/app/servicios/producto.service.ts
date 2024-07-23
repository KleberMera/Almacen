import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(private http: HttpClient, private servG: GeneralService) {}

  getproductos() {
    let url = 'listarProductos';
    return this.http.get(this.servG.URLAPI + url);
  }

  getProductosxid(id: number) {
    let url = 'listarProductosxid';
    return this.http.post(
      this.servG.URLAPI + url,
      this.servG.objectToFormData({ producto_id: id })
    );
  }

  postGrabarProductos(objProducto: any) {
    let url = '';
    if (objProducto.id == 0) {
      url = 'insertarProductos';
    } else {
      url = 'editarProductos';
    }
    return this.http.post(
      this.servG.URLAPI + url,
      this.servG.objectToFormData({
        producto_codigo: objProducto.codigo,
        producto_nombre: objProducto.nombre,
        producto_stock: objProducto.stock,
        producto_precio: objProducto.precio,
        producto_activo: objProducto.activo,
        producto_imagen: objProducto.imagen,
      })
    );
  }

  eliminarProductos(id: number) {
    let url = 'eliminarProductos';
    return this.http.post(
      this.servG.URLAPI + url,
      this.servG.objectToFormData({ producto_id: id })
    );
  }
}
