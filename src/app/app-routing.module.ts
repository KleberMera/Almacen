import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './paginas/guards/guards';
import { AuthGuardSesion } from './paginas/guards/guardsSesion';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'principal',
    loadChildren: () => import('./paginas/principal/principal.module').then( m => m.PrincipalPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'cliente/:ClienteId',
    loadChildren: () => import('./paginas/cliente/cliente.module').then( m => m.ClientePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'producto/:productosId',
    loadChildren: () => import('./paginas/producto/producto.module').then( m => m.ProductoPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./paginas/clientes/clientes.module').then( m => m.ClientesPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'productos',
    loadChildren: () => import('./paginas/productos/productos.module').then( m => m.ProductosPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'usuario/:usuarioId',
    loadChildren: () => import('./paginas/usuario/usuario.module').then( m => m.UsuarioPageModule),
    
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./paginas/usuarios/usuarios.module').then( m => m.UsuariosPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./paginas/pedidos/pedidos.module').then( m => m.PedidosPageModule),
  },
  {
    path: 'pedido/:pedidoId',
    loadChildren: () => import('./paginas/pedido/pedido.module').then( m => m.PedidoPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule),
    canLoad: [AuthGuardSesion]
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./paginas/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'detalles',
    loadChildren: () => import('./paginas/detalles/detalles.module').then( m => m.DetallesPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'detalle',
    loadChildren: () => import('./paginas/detalle/detalle.module').then( m => m.DetallePageModule),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
