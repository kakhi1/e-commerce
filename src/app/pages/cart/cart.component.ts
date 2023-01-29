import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { fadeInItems } from "@angular/material/menu";
import { loadStripe } from "@stripe/stripe-js";
import { Subscription } from "rxjs";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = { items: [] };
  dataSource: CartItem[] = [];
  displayedColumns: string[] = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];
  cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private http: HttpClient) {}
  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = _cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }
  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }
  onAddQuantity(item: CartItem) {
    this.cartService.addToCart(item);
  }
  onRemoveQuantity(item: CartItem) {
    this.cartService.removeQuantity(item);
  }
  onCheckout(): void {
    this.http
      .post("http://localhost:4242/checkout", {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          "pk_test_51MT7zBCnLX8XgnnxXDJcWoNNEa3xtmMX5TnQkvmlcKxAQGc9pxLGo3RcC1ItjEkdh1eJCZpNtwhmg3SeUDPuswo100vIfQXgHQ"
        );
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
