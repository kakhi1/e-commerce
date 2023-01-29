import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { StoreService } from "src/app/services/store.service";
const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  rowHeight: number = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  products: Array<Product> | undefined;
  sort = "desc";
  count = "12";
  productsSubscrption: Subscription | undefined;
  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}
  ngOnInit(): void {
    this.getProducts();
  }
  getProducts(): void {
    this.productsSubscrption = this.storeService
      .getAllProducts(this.count, this.sort, this.category)
      .subscribe((_products) => {
        this.products = _products;
      });
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }
  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }
  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }
  onItemsCountChange(count: number): void {
    this.count = count.toString();
    this.getProducts();
  }
  onSortChange(newSort: string): void {
    this.sort = newSort.toString();
    this.getProducts();
  }
  ngOnDestroy(): void {
    if (this.productsSubscrption) {
      this.productsSubscrption.unsubscribe();
    }
  }
}
