export interface IProducto {
    id: number,
    codigo: string,
    nombre: string,
    stock: number,
    precio: number,
    activo: boolean,
    imagen: string | null;
    agregado?: boolean;
}

export interface IProducto2 {
    id: number,
    codigo: string,
    nombre: string,
    stock: number,
    precio: number,
    activo: boolean,
    imagen: string | null;
    agregado?: boolean;
    cantidad: number;
}

/*{
    "id": 1,
    "usuario": "usuario1",
    "clave": "14e1b600b1fd579f47433b88e8d85291",
    "nombre": "Jimmy Castellanos",
    "telefono": "444444",
    "correo": "micorreo@dominio.com",
    "activo": 1
  },*/

export interface IUsuario {
    id: number,
    usuario: string,
    clave: string,
    nombre: string,
    telefono: string,
    correo: string,
    activo: boolean,
    imagen: string | null;
    agregado?: boolean;
}