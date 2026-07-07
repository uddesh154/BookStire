import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Book, Review } from '../models/book.model';

const MOCK_BOOKS: Book[] = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description:
      'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
    price: 12.99,
    originalPrice: 18.99,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=420&fit=crop',
    genre: 'Classic',
    rating: 4.5,
    reviewCount: 1240,
    isbn: '978-0743273565',
    publisher: 'Scribner',
    publishedDate: '1925-04-10',
    pages: 180,
    language: 'English',
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    isBestseller: true,
    tags: ['classic', 'american-literature', 'jazz-age'],
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description:
      'The story of young Scout Finch and her father Atticus, a lawyer who defends a Black man accused of rape in 1930s Alabama, exploring themes of racial injustice and moral growth.',
    price: 14.99,
    originalPrice: 19.99,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=420&fit=crop',
    genre: 'Classic',
    rating: 4.8,
    reviewCount: 2100,
    isbn: '978-0061935466',
    publisher: 'HarperCollins',
    publishedDate: '1960-07-11',
    pages: 336,
    language: 'English',
    inStock: true,
    stockCount: 15,
    isFeatured: true,
    isBestseller: true,
    tags: ['classic', 'pulitzer-prize', 'social-justice'],
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    description:
      'A dystopian novel set in a totalitarian society ruled by Big Brother. It follows Winston Smith who secretly hates the Party and dreams of rebellion.',
    price: 11.99,
    originalPrice: 15.99,
    coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=420&fit=crop',
    genre: 'Dystopian',
    rating: 4.7,
    reviewCount: 3500,
    isbn: '978-0451524935',
    publisher: 'Signet Classic',
    publishedDate: '1949-06-08',
    pages: 328,
    language: 'English',
    inStock: true,
    stockCount: 40,
    isFeatured: true,
    tags: ['dystopian', 'science-fiction', 'political'],
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description:
      'Elizabeth Bennet and the proud Mr. Darcy navigate love, social class, and misunderstandings in 19th-century England.',
    price: 9.99,
    originalPrice: 13.99,
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=420&fit=crop',
    genre: 'Romance',
    rating: 4.6,
    reviewCount: 1890,
    isbn: '978-0141439518',
    publisher: 'Penguin Classics',
    publishedDate: '1813-01-28',
    pages: 432,
    language: 'English',
    inStock: true,
    stockCount: 30,
    isBestseller: true,
    tags: ['romance', 'classic', 'regency'],
  },
  {
    id: 5,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description:
      'A philosophical novel about Santiago, a young Andalusian shepherd who longs to travel in search of a worldly treasure and discovers his Personal Legend.',
    price: 13.99,
    originalPrice: 17.99,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=420&fit=crop',
    genre: 'Fiction',
    rating: 4.4,
    reviewCount: 4200,
    isbn: '978-0062315007',
    publisher: 'HarperOne',
    publishedDate: '1988-01-01',
    pages: 208,
    language: 'English',
    inStock: true,
    stockCount: 50,
    isFeatured: true,
    isBestseller: true,
    tags: ['philosophy', 'self-help', 'adventure'],
  },
  {
    id: 6,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description:
      'A brief history of humankind, exploring how Homo sapiens came to dominate the Earth and the forces that have shaped our species.',
    price: 17.99,
    originalPrice: 24.99,
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=420&fit=crop',
    genre: 'Non-Fiction',
    rating: 4.7,
    reviewCount: 5600,
    isbn: '978-0062316097',
    publisher: 'Harper Perennial',
    publishedDate: '2011-01-01',
    pages: 464,
    language: 'English',
    inStock: true,
    stockCount: 20,
    isBestseller: true,
    tags: ['history', 'anthropology', 'science'],
  },
  {
    id: 7,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description:
      'Bilbo Baggins, a hobbit who enjoys a comfortable, unambitious life, is swept into an epic quest to reclaim the lost dwarf kingdom of Erebor from the fearsome dragon Smaug.',
    price: 15.99,
    originalPrice: 21.99,
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=420&fit=crop',
    genre: 'Fantasy',
    rating: 4.8,
    reviewCount: 6800,
    isbn: '978-0547928227',
    publisher: 'Houghton Mifflin Harcourt',
    publishedDate: '1937-09-21',
    pages: 310,
    language: 'English',
    inStock: true,
    stockCount: 35,
    isFeatured: true,
    isBestseller: true,
    tags: ['fantasy', 'adventure', 'tolkien'],
  },
  {
    id: 8,
    title: 'Atomic Habits',
    author: 'James Clear',
    description:
      'A practical guide for building good habits and breaking bad ones. Clear proves that tiny changes in behavior can result in remarkable results.',
    price: 19.99,
    originalPrice: 27.99,
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=420&fit=crop',
    genre: 'Self-Help',
    rating: 4.9,
    reviewCount: 9200,
    isbn: '978-0735211292',
    publisher: 'Avery',
    publishedDate: '2018-10-16',
    pages: 320,
    language: 'English',
    inStock: true,
    stockCount: 60,
    isBestseller: true,
    tags: ['self-help', 'productivity', 'psychology'],
  },
  {
    id: 9,
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    description:
      'Harry Potter discovers on his eleventh birthday that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own.',
    price: 16.99,
    originalPrice: 22.99,
    coverImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=420&fit=crop',
    genre: 'Fantasy',
    rating: 4.9,
    reviewCount: 12000,
    isbn: '978-0590353427',
    publisher: 'Scholastic',
    publishedDate: '1998-09-01',
    pages: 309,
    language: 'English',
    inStock: true,
    stockCount: 80,
    isFeatured: true,
    isBestseller: true,
    tags: ['fantasy', 'magic', 'young-adult'],
  },
  {
    id: 10,
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    description:
      'Harvard professor Robert Langdon and cryptologist Sophie Neveu investigate a murder in the Louvre, uncovering a series of secrets that could shake the foundations of Christianity.',
    price: 13.99,
    originalPrice: 18.99,
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=420&fit=crop',
    genre: 'Thriller',
    rating: 4.3,
    reviewCount: 7800,
    isbn: '978-0307474278',
    publisher: 'Anchor',
    publishedDate: '2003-03-18',
    pages: 689,
    language: 'English',
    inStock: true,
    stockCount: 45,
    tags: ['thriller', 'mystery', 'historical'],
  },
  {
    id: 11,
    title: 'Dune',
    author: 'Frank Herbert',
    description:
      'Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides whose family accepts control of the desert planet Arrakis.',
    price: 18.99,
    originalPrice: 25.99,
    coverImage: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=300&h=420&fit=crop',
    genre: 'Science Fiction',
    rating: 4.8,
    reviewCount: 8900,
    isbn: '978-0441013593',
    publisher: 'Ace',
    publishedDate: '1965-08-01',
    pages: 896,
    language: 'English',
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    tags: ['science-fiction', 'epic', 'space-opera'],
  },
  {
    id: 12,
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    description:
      'Drawing on stories of Andrew Carnegie, Thomas Edison, Henry Ford, and other millionaires, Napoleon Hill explains the key to success through thought, desire, and planning.',
    price: 10.99,
    originalPrice: 14.99,
    coverImage: 'https://images.unsplash.com/photo-1491841651911-c44484df2d2e?w=300&h=420&fit=crop',
    genre: 'Self-Help',
    rating: 4.5,
    reviewCount: 6300,
    isbn: '978-1585424337',
    publisher: 'Tarcher',
    publishedDate: '1937-01-01',
    pages: 233,
    language: 'English',
    inStock: true,
    stockCount: 55,
    tags: ['self-help', 'success', 'business'],
  },
];

const MOCK_REVIEWS: Review[] = [
  { id: 1, bookId: 1, userName: 'Alice M.', rating: 5, comment: 'A timeless classic! Beautifully written.', date: '2024-01-15' },
  { id: 2, bookId: 1, userName: 'Bob K.', rating: 4, comment: 'Great story, loved the characters.', date: '2024-02-20' },
  { id: 3, bookId: 2, userName: 'Carol T.', rating: 5, comment: 'One of the best books I have ever read.', date: '2024-01-10' },
  { id: 4, bookId: 3, userName: 'Dave L.', rating: 5, comment: 'Chilling and prophetic. A must-read.', date: '2024-03-05' },
  { id: 5, bookId: 5, userName: 'Eve S.', rating: 4, comment: 'Inspiring and thought-provoking journey.', date: '2024-02-14' },
  { id: 6, bookId: 7, userName: 'Frank G.', rating: 5, comment: 'Perfect fantasy adventure for all ages.', date: '2024-01-28' },
  { id: 7, bookId: 8, userName: 'Grace H.', rating: 5, comment: 'Life-changing approach to building habits.', date: '2024-03-10' },
];

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books$ = new BehaviorSubject<Book[]>(MOCK_BOOKS);

  getBooks(): Observable<Book[]> {
    return this.books$.asObservable();
  }

  getBookById(id: number): Observable<Book | undefined> {
    const book = MOCK_BOOKS.find((b) => b.id === id);
    return of(book);
  }

  getFeaturedBooks(): Observable<Book[]> {
    return of(MOCK_BOOKS.filter((b) => b.isFeatured));
  }

  getBestsellerBooks(): Observable<Book[]> {
    return of(MOCK_BOOKS.filter((b) => b.isBestseller));
  }

  searchBooks(query: string): Observable<Book[]> {
    const q = query.toLowerCase();
    const filtered = MOCK_BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
    );
    return of(filtered);
  }

  getBooksByGenre(genre: string): Observable<Book[]> {
    if (genre === 'All') {
      return of(MOCK_BOOKS);
    }
    return of(MOCK_BOOKS.filter((b) => b.genre === genre));
  }

  getGenres(): string[] {
    const genres = [...new Set(MOCK_BOOKS.map((b) => b.genre))];
    return ['All', ...genres.sort()];
  }

  getReviewsByBookId(bookId: number): Observable<Review[]> {
    return of(MOCK_REVIEWS.filter((r) => r.bookId === bookId));
  }
}
