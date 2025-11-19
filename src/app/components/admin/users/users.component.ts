import { Component } from '@angular/core';
import { User } from '../../../interfaces/user';
import { enviroment } from '../../../../enviroments/enviroment';
import { APIService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Order } from '../../../interfaces/order';
import { OrderData } from '../../../interfaces/orderData';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
//Lapozásos miújságok----
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedUser:User[] = []
  userOrders:Order[]=[];
  orderdatas:OrderData[]=[];
  selectedUser: User | null = null; 
  loggedUser:User= {
    id: 0,
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "",
    phone: "",
    address: "",
    reg: "",
    lastLog: "",
    status: false
  };
  //-----------------------
  
  
  selectedFile: File | null = null;
  
  
  formModal:any 
  confirmModal:any
  currency = enviroment.currency
  users: User[] = []
  editmode = false;
  
  user:User = {
    id: 0,
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "",
    phone: "",
    address: "",
    reg: "",
    lastLog: "",
    status: false
  };

  constructor(
    private Api: APIService,
    private mess: MessageService,
    private Auth:AuthService
  ){}


  ngOnInit(): void {
    this.formModal = new bootstrap.Modal('#infoModal')
    this.getUsers()
  }  

  getUsers(){
    this.Api.SelectAll('users').then(res =>{
      this.users = res.data
      this.totalPages = Math.ceil(this.users.length/this.pageSize)
      this.setPage(1)
    })
  }

  setPage(page:number){
    
    this.currentPage = page;
    const startIndex = (page -1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUser = this.users.slice(startIndex,endIndex)
  }

  getUser(id:any){
    this.Api.Select('users', id).then(res =>{
      this.user = res.data[0];
      console.log(res.data[0]);
      this.selectedUser = res.data[0];
      this.formModal.show();
    })
    this.Api.SelectOrders('orders',id).then(res=>{
      this.orderdatas=res.data;
      console.log(this.orderdatas);
    })
    
  }
    banUser(id:any){
      
      this.Api.Select('users', id).then(res =>{
        this.user = res.data[0];
        this.selectedUser = res.data[0];
        
      })
      if(this.selectedUser?.status==false){
        this.Api.Update('users', id, {status: 1}).then(res =>{
          this.mess.show('success',"ok", 'Felhasználó sikeresen feloldva!')
          this.getUsers()
        })
      }
      else{
        this.Api.Update('users', id, {status: false}).then(res =>{
          this.mess.show('success',"ok", 'Felhasználó sikeresen letiltva!')
          this.getUsers()
        })
      }

  }
}
      
                            