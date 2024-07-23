import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private srvG: GeneralService, private http: HttpClient
  ) { }

  getUsuarios() {
    let url = 'listarUsuarios';
    return this.http.get(this.srvG.URLAPI + url);
    
    //http://127.0.0.1/API2024ALMACEN/listarUsuarios
  }


  login(objsUsuario: any) {
    let url = 'login';
    return this.http.post(
      this.srvG.URLAPI + url,
      this.srvG.objectToFormData(
        {
          usuario_usuario: objsUsuario.usuario,
          usuario_clave: objsUsuario.clave
        }
      )
    );
  }
        

}
