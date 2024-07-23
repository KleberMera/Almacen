import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardSesion implements CanLoad {

  constructor(private router: Router) { }

  canLoad() {
    if (localStorage.getItem('usuarioLogueado')) {
      this.router.navigateByUrl('/principal'); // Redirige a la página principal si el usuario ya ha iniciado sesión
      return false;
    }
    return true;
  }
}
