import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, Review } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  reviews: Review[] = [];
  quantity = 1;
  addedToCart = false;
  activeTab: 'description' | 'details' | 'reviews' = 'description';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBookById(id).subscribe((book) => {
      if (!book) {
        this.router.navigate(['/not-found']);
        return;
      }
      this.book = book;
    });
    this.bookService.getReviewsByBookId(id).subscribe((r) => (this.reviews = r));
  }

  addToCart(): void {
    if (!this.book) return;
    this.cartService.addToCart(this.book, this.quantity);
    this.addedToCart = true;
    setTimeout(() => (this.addedToCart = false), 2500);
  }

  buyNow(): void {
    if (!this.book) return;
    this.cartService.addToCart(this.book, this.quantity);
    this.router.navigate(['/cart']);
  }

  setQuantity(val: number): void {
    if (!this.book) return;
    this.quantity = Math.max(1, Math.min(val, this.book.stockCount));
  }

  getRatingStars(rating: number): boolean[] {
    return [1, 2, 3, 4, 5].map((s) => s <= rating);
  }

  setTab(tab: 'description' | 'details' | 'reviews'): void {
    this.activeTab = tab;
  }

  getDiscountPercent(): number {
    if (!this.book?.originalPrice) return 0;
    return Math.round(((this.book.originalPrice - this.book.price) / this.book.originalPrice) * 100);
  }
}
