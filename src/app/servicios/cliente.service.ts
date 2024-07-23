import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private http: HttpClient, private serG: GeneralService) {}

  getClientes() {
    let url = 'listarClientes';
    return this.http.get<any>(this.serG.URLAPI + url);
  }

  getClientesTodoslosnombres() {
    let url = 'listarClientesNombres';
    return this.http.get<any>(this.serG.URLAPI + url);
  }

  getClientesxid(id: number) {
    let url = 'listarclientesxid';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({ cliente_id: id })
    );
  }

  postGrabar(objCliente: any) {
    let url = '';
    if (objCliente.id == 0) {
      url = 'insertarClientes';
    } else {
      url = 'editarClientes';
    }
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({
        cliente_cedula: objCliente.identificacion,
        cliente_nombre: objCliente.nombre,
        cliente_telefono: objCliente.telefono,
        cliente_correo: objCliente.correo,
        cliente_direccion: objCliente.direccion,
        cliente_pais: objCliente.pais,
        cliente_ciudad: objCliente.ciudad,
        //cliente_id: objCliente.id
      })
    );
  }

  eliminarClientes(id: number) {
    let url = 'eliminarClientes';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({ cliente_id: id })
    );
  }

  getClientexnombre(nombre: string) {
    let url = 'listarClientesPorNombre';
    return this.http.post(
      this.serG.URLAPI + url,
      this.serG.objectToFormData({ cliente_nombre: nombre })
    );
  }
}
