import { Component } from '@angular/core';
import { Order } from '../../../interfaces/order';
import { enviroment } from '../../../../enviroments/enviroment';
import { APIService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
   lightBoxVisible = false;
    lightBoxUrl = "";
  
  //Lapozásos miújságok----
    currentPage = 1;
    pageSize = 5;
    totalPages = 1;
    pagedOrders:Order[] = []
    //-----------------------
    
    
    
    
    formModal:any 
    confirmModal:any
    currency = enviroment.currency
    orders: Order[] = []
    editmode = false;
    
    orderos:Order = {
      id: 0,
      user_id:0,
      total:0,
      status:"",
      created_at:"",
      updated_at:""
    };
  
    constructor(
      private Api: APIService,
      private mess: MessageService
    ){}
  
  
    ngOnInit(): void {
      this.getOrders()
    }  
  
    getOrders(){
      this.Api.SelectAll('orders').then(res =>{
        this.orders = res.data
        this.totalPages = Math.ceil(this.orders.length/this.pageSize)
        this.setPage(1)
      })
    }
  
    setPage(page:number){
      
      this.currentPage = page;
      const startIndex = (page -1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedOrders = this.orders.slice(startIndex,endIndex)
    }
    finishOrder(id:number)
    {
      this.Api.Update('orders', id, {status: "completed"}).then(res =>{
        this.mess.show('success',"ok", 'Felhasználó sikeresen letiltva!')
        this.getOrders()
        
      })
    }
    getOrder(id:number){
      this.Api.Select('orders', id).then(res =>{
        this.orderos = res.data[0];
        
      })
    }
  
}
