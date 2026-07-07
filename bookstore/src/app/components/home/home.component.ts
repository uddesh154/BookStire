import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  featuredBooks: Book[] = [];
  bestsellerBooks: Book[] = [];
  addedToCartId: number | null = null;

  genres = [
    { name: 'Fiction', icon: 'fas fa-feather-alt', color: '#3b82d4' },
    { name: 'Fantasy', icon: 'fas fa-dragon', color: '#7c5cd8' },
    { name: 'Science Fiction', icon: 'fas fa-rocket', color: '#06b6d4' },
    { name: 'Thriller', icon: 'fas fa-bolt', color: '#f59e0b' },
    { name: 'Romance', icon: 'fas fa-heart', color: '#ec4899' },
    { name: 'Non-Fiction', icon: 'fas fa-globe', color: '#10b981' },
    { name: 'Classic', icon: 'fas fa-landmark', color: '#6b7280' },
    { name: 'Self-Help', icon: 'fas fa-star', color: '#f97316' },
  ];

  constructor(private bookService: BookService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.bookService.getFeaturedBooks().subscribe((books) => (this.featuredBooks = books));
    this.bookService.getBestsellerBooks().subscribe((books) => (this.bestsellerBooks = books.slice(0, 4)));
  }

  addToCart(book: Book, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(book);
    this.addedToCartId = book.id;
    setTimeout(() => (this.addedToCartId = null), 2000);
  }

  viewBook(bookId: number): void {
    this.router.navigate(['/books', bookId]);
  }

  browseGenre(genre: string): void {
    this.router.navigate(['/books'], { queryParams: { genre } });
  }
}
