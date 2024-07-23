import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general.service';

import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from 'src/app/servicios/producto.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage {
  id: number = 0;
  codigo: string = '';
  nombre: string = '';
  stock: string = '';
  precio: string = '';
  activo: boolean = true;
  imagen: string = '';

  constructor(
    private servP: ProductosService,
    public servG: GeneralService,
    private LoadingController: LoadingController,
    private route: ActivatedRoute,
    private ToastController: ToastController,
    private platform: Platform,
    private httpClient: HttpClient
  ) {
    this.id = this.route.snapshot.params['productosId']
      ? this.route.snapshot.params['productosId']
      : 0;
    console.log('El id retornado es: ' + this.id);
  }

  async ionViewWillEnter() {
    if (this.id > 0) {
      const loading = await this.LoadingController.create({
        message: 'Cargando producto...',
        spinner: 'bubbles',
        animated: true,
      });
      loading.present();

      this.servP.getProductosxid(this.id).subscribe((res: any) => {
        console.log(res.data[0]);
        console.log('El id del cliente es: ' + this.id);
        //this.id = res.data[0].id;
        this.codigo = res.data[0].codigo;
        this.nombre = res.data[0].nombre;
        this.stock = res.data[0].stock;
        this.precio = res.data[0].precio;
        this.activo = res.data[0].activo;
        this.imagen = res.data[0].imagen;

        loading.dismiss();
      });
    } else {
      //this.servG.fun_Mensaje("No se encontro el producto");
      //this.servG.irA("/productos");
    }
  }

  async fun_grabar() {
    if (this.codigo == '') {
      this.mensaje('Debe registrar el codigo', 'danger');
    } else if (this.nombre == '') {
      this.mensaje('Debe registrar el nombre', 'danger');
    } else {
      let l = await this.LoadingController.create();
      l.present();

      this.servP
        .postGrabarProductos({
          id: this.id,
          codigo: this.codigo,
          nombre: this.nombre,
          stock: this.stock,
          precio: this.precio,
          //Validar que el toggle esté activo o no
          activo: this.activo ? 1 : 0,
          //Si no se selecciona una imagen, se pone la en null
          imagen: this.imagen == '' ? null : this.imagen,
        })
        .subscribe(
          (res: any) => {
            l.dismiss();
            this.mensaje(res.mensaje, 'primary');
            this.servG.irA('/productos');
          },
          (err: any) => {
            console.log(err);
            this.servG.fun_Mensaje('Error al registrar el producto');
          }
        );
    }
  }

  cambiarImagen() {
    //Tomar o seleccionar una imagen
    this.tomaroseleccionarImagen();
  }

  async tomaroseleccionarImagen() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    console.log('Imagen tomada: ' + image);
    var imagen = image.webPath;

    console.log(this.imagen);

    //Verificar que la imagen no sea nula
    if (imagen != null) {
      this.imagen = imagen;
      console.log(this.imagen);
    }
  }

  async mensaje(texto: string, tipo: string = '') {
    let t = await this.ToastController.create({
      message: texto,
      color: tipo,
      duration: 3000,
    });
    t.present();
  }

  eliminarImagen() {
    if (this.imagen == null || this.imagen == '') {
      this.mensaje('No tiene imagen', 'danger');
    } else {
      this.mensaje('Eliminando imagen', 'primary');
      this.imagen = '';
    }
  }
}
