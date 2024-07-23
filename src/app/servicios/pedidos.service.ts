import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  public usuarioId: number | null = null;
  public usuarioDatos: any = null;

 
  constructor(private http: HttpClient,
    private serG: GeneralService
  ) { }

  insertarPedido(pedido: any): Observable<any> {
    let url = 'insertarPedidos'; // La URL del backend para insertar pedidos
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({
        pedido_cliente_id: pedido.cliente_id,
        pedido_usuario_id: pedido.usuario_id,
        pedido_fecha: pedido.fecha,
        pedido_estado: pedido.estado
      })
    );
  }

  insertarDetalle(detalle: any): Observable<any> {
    const url = 'insertarPedidosDetalles'; // La URL del backend para insertar detalles de pedido
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({
        detalle_pedido_producto_id: detalle.producto_id,
        detalle_pedido_id: detalle.pedido_id,
        detalle_pedido_cantidad: detalle.cantidad
      })
    );
  }

  
  setUsuarioId(id: number) {
    this.usuarioId = id;
  }

  getUsuarioId(): number | null {
    return this.usuarioId;
  }

  getUsuarioDatos(): any {
    console.log('Datos obtenidos en PedidosService:', this.usuarioDatos);
    return this.usuarioDatos;
  }
  
}
