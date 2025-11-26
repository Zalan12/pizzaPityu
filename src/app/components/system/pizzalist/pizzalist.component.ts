import { Component, OnInit } from '@angular/core';
import { enviroment } from '../../../../enviroments/enviroment';
import { Pizza } from '../../../interfaces/pizza';
import { APIService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pizzalist',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './pizzalist.component.html',
  styleUrl: './pizzalist.component.scss'
})
export class PizzalistComponent implements OnInit{

  
  formModal:any 
  confirmModal:any
  currency = enviroment.currency
  pizzas: Pizza[] = []
  filteredPizzas:Pizza[]=[];



  editmode = false;

  searchTerm='';

  isLoggedIn = false;
  
  pizza:Pizza = {
    id: 0,
    name: "",
    descrip: "",
    calories: 0,
    price: 0
  };

  constructor(
    private Api: APIService,
    private mess: MessageService,
    private auth:AuthService
  ){}


  ngOnInit(): void {

    this.getPizzas()
  }  

  getPizzas(){
    this.Api.SelectAll('pizzas').then(res =>{
      this.pizzas = res.data;
      this.pizzas.forEach(pizza=>pizza.amount=0);

      this.filteredPizzas=this.pizzas;
      
    })
  }
  addToCart(pizzaId:number)
  {
      const pizza=this.pizzas.find(pizza=> pizza.id==pizzaId);
      const amount=pizza!.amount;

      if(amount==0){
        this.mess.show('danger','hiba','Nem adtál meg érvényes értéket!');
        return;
      }

      let data={

        userId:this.auth.loggedUser()[0].id,
        pizzaId:pizzaId,
        amount:amount
      }
      pizza!.amount=0;

      this.Api.SelectAll('carts/userID/eq/'+data.userId).then(res=>{
        let idx=-1;
        if(res.data.length>0){
        let idx= res.data.findIndex((item: {pizzaId:Number})=>item.pizzaId==data.pizzaId);
      }

      if(idx>-1)
      {
        data.amount= res.data.amount+amount;
        this.Api.Update('carts', res.data[idx].id, data).then(res=>{});
        this.mess.show('success', 'OK', 'A tételek darabszáma sikeresen módoult')

      }
      else
      {
        this.Api.Insert('carts',data).then(res=>{});
        this.mess.show('success','SIker','gkjdlgdarlu')
      }

      })
  }

  filterPizzas()
  {
    const term=this.searchTerm.toLocaleLowerCase().trim();
    this.filteredPizzas=this.pizzas.filter(p=> this.pizza.name.toLocaleLowerCase().includes(term)||p.descrip?.toLocaleLowerCase().includes(term))
  }

}
