import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private srvG: GeneralService, private http: HttpClient) {}

  getUsuarios() {
    let url = 'listarUsuarios';
    return this.http.get(this.srvG.URLAPI + url);
    //http://127.0.0.1/API2024ALMACEN/listarUsuarios
  }

  getUsuariosxid(id: number) {
    let url = 'listarusuariosxid';
    return this.http.post(
      this.srvG.URLAPI + url,
      this.srvG.objectToFormData({ usuario_id: id })
    );
  }

  eliminarUsuarios(id: number) {
    let url = 'eliminarUsuarios';
    return this.http.post(
      this.srvG.URLAPI + url,
      this.srvG.objectToFormData({ usuario_id: id })
    );
  }

  postGrabarUsuarios(objsUsuario: any) {
    /*{
      "id": "2",
      "usuario": "usuario2",
      "clave": "14e1b600b1fd579f47433b88e8d85291",
      "nombre": "Kleber",
      "telefono": "55555",
      "correo": "@example.com",
      "activo": "1"
  }*/
    let url = '';
    if (objsUsuario.id == 0) {
      url = 'insertarUsuarios';
    } else {
      url = 'editarUsuarios';
    }
    return this.http.post(
      this.srvG.URLAPI + url,
      this.srvG.objectToFormData({
        usuario_usuario: objsUsuario.usuario,
        usuario_clave: objsUsuario.clave,
        usuario_nombre: objsUsuario.nombre,
        usuario_telefono: objsUsuario.telefono,
        usuario_correo: objsUsuario.correo,
        usuario_activo: objsUsuario.activo,
      })
    );
  }
}
