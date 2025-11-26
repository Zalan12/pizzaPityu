import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem } from '../../../interfaces/cartItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
  constructor (
    private api:APIService,
    private auth:AuthService
  ){}

  items:CartItem[]=[]
  ngOnInit(): void {
    this.api.SelectAll('carts_vt/userId/eq/'+this.auth.loggedUser()[0].id).then(res=>{
        this.items=res.data as CartItem[]
    })
  }
}
