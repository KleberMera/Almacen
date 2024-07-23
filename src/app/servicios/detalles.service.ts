import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root',
})
export class DetallesService {
  constructor(private http: HttpClient, private serG: GeneralService) {}

  detallesresumenxid(id: number) {
    let url = 'obtenerResumenPedidosDetallesUsuario';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({ usuario_id: id })
    );
  }

  detallescompletos(id: number, nombre: string) {
    let url = 'listarPedidosDetallesUsuario';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({ usuario_id: id, nombre_cliente: nombre })
    );
  }

  borrarDetalle(detalleID: number) {
    let url = 'eliminarPedidosDetalles';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({ detalle_id: detalleID })
    );
  }

  detallesPor_IdPedido_Nombre_IDusuario(
    idPedido: number,
    nombre: string,
    idUsuario: number
  ) {
    let url = 'listarPedidosDetallesPorUsuarioPorIDPorNombre';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({
        pedido_id: idPedido,
        nombre_cliente: nombre,
        usuario_id: idUsuario,
      })
    );
  }

  obtenerPedidos(idUsuario: number, nombre: string) {
    let url = 'listarPedidosPorUsuarioYNombre';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({
        usuario_id: idUsuario,
        nombre_cliente: nombre,
      })
    );
  }

  eliminarDetallesPedido(pedidoId: number) {
    let url = 'eliminarPedidosDetallesxPedidoID';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({ pedido_id: pedidoId })
    );
  }

  eliminarPedido(pedidoId: number) {
    let url = 'eliminarPedidos';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({ pedido_id: pedidoId })
    );
  }

 
}
