import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit, OnDestroy {
  allBooks: Book[] = [];
  filteredBooks: Book[] = [];
  genres: string[] = [];
  activeGenre = 'All';
  sortBy = 'default';
  searchQuery = '';
  addedToCartMap: { [id: number]: boolean } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.genres = this.bookService.getGenres();

    this.bookService
      .getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((books) => {
        this.allBooks = books;
        this.applyFilters();
      });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.searchQuery = params['q'] || '';
      this.activeGenre = params['genre'] || 'All';
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterByGenre(genre: string): void {
    this.activeGenre = genre;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { genre: genre === 'All' ? null : genre, q: this.searchQuery || null },
      queryParamsHandling: 'merge',
    });
  }

  applyFilters(): void {
    let result = [...this.allBooks];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    if (this.activeGenre !== 'All') {
      result = result.filter((b) => b.genre === this.activeGenre);
    }

    switch (this.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    this.filteredBooks = result;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.activeGenre = 'All';
    this.sortBy = 'default';
    this.router.navigate(['/books']);
  }

  addToCart(book: Book, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(book);
    this.addedToCartMap[book.id] = true;
    setTimeout(() => delete this.addedToCartMap[book.id], 2000);
  }

  viewBook(id: number): void {
    this.router.navigate(['/books', id]);
  }

  getDiscountPercent(book: Book): number {
    if (!book.originalPrice) return 0;
    return Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
  }
}
