import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cart } from '../../models/cart.model';
import { Order } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart!: Cart;
  shippingForm!: FormGroup;
  selectedPayment = 'credit-card';
  orderPlaced = false;
  orderSummary: Order | null = null;
  submitting = false;

  countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'Japan'];

  paymentMethods = [
    { value: 'credit-card', label: 'Credit / Debit Card', icon: 'fas fa-credit-card' },
    { value: 'paypal', label: 'PayPal', icon: 'fab fa-paypal' },
    { value: 'cod', label: 'Cash on Delivery', icon: 'fas fa-money-bill-wave' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    this.shippingForm = this.fb.group({
      fullName: [user ? `${user.firstName} ${user.lastName}` : '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['United States', Validators.required],
    });

    this.cartService
      .getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cart = cart;
        if (cart.items.length === 0 && !this.orderPlaced) {
          this.router.navigate(['/cart']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.shippingForm.get(field);
    return !!(ctrl?.invalid && ctrl?.errors?.[error] && ctrl?.touched);
  }

  placeOrder(): void {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const user = this.authService.getCurrentUser();
    const form = this.shippingForm.value;

    setTimeout(() => {
      const order: Order = {
        id: `ORD-${Date.now()}`,
        userId: user?.id || 0,
        items: [...this.cart.items],
        shippingAddress: form,
        subtotal: this.cart.subtotal,
        discount: this.cart.discount,
        tax: this.cart.tax,
        total: this.cart.total,
        status: 'pending',
        paymentMethod: this.selectedPayment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.orderSummary = order;
      this.orderPlaced = true;
      this.submitting = false;
      this.cartService.clearCart();
    }, 1500);
  }
}
