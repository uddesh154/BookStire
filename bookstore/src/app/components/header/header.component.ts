import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount = 0;
  isLoggedIn = false;
  currentUser: User | null = null;
  isMenuOpen = false;
  searchQuery = '';
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService
      .getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => (this.cartItemCount = cart.totalItems));

    this.authService
      .getAuthState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.isLoggedIn = state.isAuthenticated;
        this.currentUser = state.user;
      });

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => (this.isMenuOpen = false));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/books'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
