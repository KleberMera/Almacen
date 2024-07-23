import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RecuperarService {
  constructor(private srvG: GeneralService,
    private http: HttpClient
  ) {}

  reestablecer(objsUsuario: any) {
    let url = 'cambiarClave';
    return this.http.post(
      this.srvG.URLAPI + url,
      this.srvG.objectToFormData({
        usuario_usuario: objsUsuario.usuario,
        usuario_clave: objsUsuario.clave,
       
      })
    );
   
  }
}
