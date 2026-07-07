# 📚 Angular Bookstore — Ecommerce App

A fully-featured ecommerce bookstore application built with **Angular 17**. Browse books, manage a shopping cart, checkout, and manage your account.

---

## Features

- 🏠 **Home Page** — Hero banner + featured books
- 📖 **Book Catalog** — Browse, search, filter by genre, sort by price/rating
- 📄 **Book Detail** — Full description, author info, reviews, add to cart
- 🛒 **Shopping Cart** — Add/remove items, update quantities, running total
- 💳 **Checkout** — Shipping address form and order summary
- 🔐 **Authentication** — Register, Login, Logout (session via localStorage)
- 👤 **User Account** — Order history
- 🔒 **Route Guards** — Protect checkout & account pages

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── home/
│   │   ├── book-list/
│   │   ├── book-detail/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── register/
│   │   └── not-found/
│   ├── models/
│   │   ├── book.model.ts
│   │   ├── cart.model.ts
│   │   ├── order.model.ts
│   │   └── user.model.ts
│   ├── services/
│   │   ├── book.service.ts
│   │   ├── cart.service.ts
│   │   └── auth.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   └── app.component.ts
├── assets/
├── styles.scss
├── index.html
└── main.ts
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser
http://localhost:4200
```

---

## Build

```bash
npm run build
```

Built files will be in the `dist/` folder.
