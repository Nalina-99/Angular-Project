import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cart, priceSummary } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };
  constructor(
    private product: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  removeToCart(cartId: number | undefined) {
    cartId &&
      this.cartData &&
      this.product.removeToCart(cartId).subscribe((result) => {
        this.loadDetails();
      });
  }

  loadDetails() {
    this.product.currentCart().subscribe((result: any[]) => {
      console.log('CART RESULT:', result);

      if (!result || result.length === 0) {
        this.priceSummary = {
          price: 0,
          discount: 0,
          tax: 0,
          delivery: 0,
          total: 0,
        };
        return;
      }

      this.cartData = result;

      let price = 0;

      for (let item of result) {
        const itemPrice = parseFloat(item.price);
        const itemQty = item.quantity ? Number(item.quantity) : 1;

        if (!isNaN(itemPrice)) {
          price += itemPrice * itemQty;
        }
      }

      this.priceSummary.price = price;
      this.priceSummary.discount = price * 0.1;
      this.priceSummary.tax = price * 0.05;
      this.priceSummary.delivery = 10;

      this.priceSummary.total =
        price +
        this.priceSummary.tax +
        this.priceSummary.delivery -
        this.priceSummary.discount;
    });
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
