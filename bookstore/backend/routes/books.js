import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data', 'books.json');

function loadBooks() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

router.get('/', (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    pageSize = 20,
    inStock,
  } = req.query;

  let books = loadBooks();

  // Filter by category
  if (category) {
    const categories = Array.isArray(category) ? category : String(category).split(',');
    books = books.filter((b) => categories.map((c) => c.toLowerCase()).includes(b.category.toLowerCase()));
  }

  // Search by title/author
  if (search) {
    const q = String(search).toLowerCase();
    books = books.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  // Price range (ignore empty strings)
  const hasMin = minPrice !== undefined && minPrice !== '';
  const hasMax = maxPrice !== undefined && maxPrice !== '';
  if (hasMin) {
    const min = Number(minPrice);
    if (!Number.isNaN(min)) {
      books = books.filter((b) => b.price >= min);
    }
  }
  if (hasMax) {
    const max = Number(maxPrice);
    if (!Number.isNaN(max)) {
      books = books.filter((b) => b.price <= max);
    }
  }

  // In stock
  if (inStock === 'true') {
    books = books.filter((b) => b.stock > 0);
  }

  // Sorting
  const sortKey = String(sort || '').toLowerCase();
  if (sortKey === 'price_asc') books.sort((a, b) => a.price - b.price);
  if (sortKey === 'price_desc') books.sort((a, b) => b.price - a.price);
  if (sortKey === 'newest') books.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  if (sortKey === 'alpha') books.sort((a, b) => a.title.localeCompare(b.title));

  // Pagination
  const p = Number(page) || 1;
  const ps = Number(pageSize) || 20;
  const start = (p - 1) * ps;
  const paged = books.slice(start, start + ps);

  res.json({ books: paged, total: books.length });
});

router.get('/:id', (req, res) => {
  const books = loadBooks();
  const book = books.find((b) => String(b.id) === String(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

export default router;


