import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const booksPath = path.join(__dirname, '..', 'data', 'books.json');
const ordersPath = path.join(__dirname, '..', 'data', 'orders.json');

function loadBooks() {
  return JSON.parse(fs.readFileSync(booksPath, 'utf-8'));
}
function loadOrders() {
  try {
    return JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  } catch {
    return [];
  }
}
function saveOrders(orders) {
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
}

function generateOrderId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const ts = `${yyyy}${mm}${dd}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${ts}-${rand}`;
}

router.get('/', (req, res) => {
  const orders = loadOrders();
  res.json({ orders });
});

router.post('/', (req, res) => {
  const { customer, items, subtotal, shipping = 0, total, notes } = req.body || {};

  if (!customer || !customer.name || !customer.email || !customer.address) {
    return res.status(400).json({ message: 'Invalid customer info' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  const books = loadBooks();
  const idToBook = new Map(books.map((b) => [String(b.id), b]));
  const adjustedItems = [];
  const warnings = [];
  let computedSubtotal = 0;

  for (const it of items) {
    const book = idToBook.get(String(it.bookId));
    if (!book) {
      warnings.push(`Book ${it.bookId} not found and was removed.`);
      continue;
    }
    const quantity = Math.max(0, Math.min(Number(it.quantity) || 0, book.stock));
    if (quantity === 0) {
      warnings.push(`Book ${book.title} is out of stock or quantity was zero.`);
      continue;
    }
    if (quantity < (Number(it.quantity) || 0)) {
      warnings.push(`Adjusted quantity for ${book.title} to available stock (${quantity}).`);
    }
    adjustedItems.push({
      bookId: String(book.id),
      title: book.title,
      price: Number(book.price),
      quantity,
    });
    computedSubtotal += Number(book.price) * quantity;
  }

  if (adjustedItems.length === 0) {
    return res.status(400).json({ message: 'No valid items to place order', warnings });
  }

  const finalSubtotal = Math.round((computedSubtotal + Number.EPSILON) * 100) / 100;
  const finalShipping = Math.round(((Number(shipping) || 0) + Number.EPSILON) * 100) / 100;
  const finalTotal = Math.round((finalSubtotal + finalShipping + Number.EPSILON) * 100) / 100;

  const orderId = generateOrderId();
  const savedOrder = {
    orderId,
    status: 'placed',
    placedAt: new Date().toISOString(),
    customer,
    items: adjustedItems,
    subtotal: finalSubtotal,
    shipping: finalShipping,
    total: finalTotal,
    notes: notes || 'Mock order',
  };

  const orders = loadOrders();
  orders.push(savedOrder);
  saveOrders(orders);

  res.status(201).json({ orderId, status: 'placed', order: savedOrder, warnings });
});

export default router;


