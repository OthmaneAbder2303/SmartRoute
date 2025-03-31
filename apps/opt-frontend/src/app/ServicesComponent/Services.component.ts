import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from "@angular/router";

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './Services.component.html',
  styleUrl: './Services.component.scss',
})
export class ServicesComponent {
  usemap() {

  }
  constructor(private  router:Router) {
  }
  gotomap() {
    this.router.navigate(['map'])
  }
}
