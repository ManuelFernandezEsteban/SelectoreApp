import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from "rxjs/operators";

import { PaisesSmall, PaisLarge } from '../../interfaces/paises.interface';
import { PaisesServiceService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: [
  ]
})
export class SelectorComponent implements OnInit {

  miFormulario:FormGroup=this.fb.group({
    region:['',Validators.required],
    pais:['',Validators.required],
    frontera:['',Validators.required]
  });

  regiones:string[]=[];
  paises:PaisesSmall[]=[];
  //fronteras:string[]=[];
  fronteras:PaisesSmall[]=[];
  cargando:boolean=false;


  constructor(private fb:FormBuilder,
              private ps:PaisesServiceService) { }

  ngOnInit(): void {
    this.regiones=this.ps.regiones;
  
    this.miFormulario.get('region')?.valueChanges.
      pipe(
        tap(region=>{
          this.miFormulario.get('pais')?.reset('');
          this.cargando=true;
        }),
        switchMap( region=>this.ps.getPaisesPorRegion(region))
      )
      .subscribe(paises=>{        
        this.paises=paises;
        this.cargando=false;
      });
      this.miFormulario.get('pais')?.valueChanges.
      pipe(
        tap( ()=> {
          this.fronteras=[];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando=true;
        }),
        switchMap( codigo => this.ps.getPaisByCode(codigo)),
        switchMap(pais=>this.ps.getPaisesPorCodigo(pais?.borders!))
      ).
        subscribe(paises=>{
          this.cargando=false;
          console.log(paises);          
          this.fronteras=paises;
        })
  }

  guardar(){
    console.log(this.miFormulario.value);
  }
}
