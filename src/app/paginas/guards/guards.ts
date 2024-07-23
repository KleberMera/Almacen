import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private router: Router) { }

  canLoad() {
    if (!localStorage.getItem('usuarioLogueado')) {
      this.router.navigateByUrl('/login'); // Redirige a la página de inicio de sesión si el usuario no ha iniciado sesión
      return false;
    }
    return true;
  }
}
