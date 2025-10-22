// app.js
const express = require("express");
const app = express();

app.use(express.json()); // Middleware to parse JSON data

// --------------------------------
// Sample in-memory data
// --------------------------------
let books = [
  { id: 1, title: "Harry Potter", author: "J.K. Rowling", available: true },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", available: true },
  { id: 3, title: "1984", author: "George Orwell", available: false },
];

let users = [
  { id: 1, name: "Alice", subscribed: true, borrowedBooks: [3] },
  { id: 2, name: "Bob", subscribed: false, borrowedBooks: [] },
];

// --------------------------------
// PART A: ROUTING BASICS
// --------------------------------

// 1️⃣ View list of all books
app.get("/books", (req, res) => {
  res.json(books);
});

// 2️⃣ Manage library user subscriptions (toggle subscription)
app.put("/users/:id/subscribe", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.subscribed = !user.subscribed;
  res.json({ message: `User subscription updated`, user });
});

// 3️⃣ Borrow a book
app.post("/borrow/:userId/:bookId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const bookId = parseInt(req.params.bookId);

  const user = users.find(u => u.id === userId);
  const book = books.find(b => b.id === bookId);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!book.available) return res.status(400).json({ message: "Book not available" });

  user.borrowedBooks.push(bookId);
  book.available = false;

  res.json({ message: `${user.name} borrowed ${book.title}`, user, book });
});

// 4️⃣ Return a book
app.get("/users/:id/subscribe", (req, res) => {

  const userId = parseInt(req.params.userId);
  const bookId = parseInt(req.params.bookId);

  const user = users.find(u => u.id === userId);
  const book = books.find(b => b.id === bookId);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!book) return res.status(404).json({ message: "Book not found" });

  user.borrowedBooks = user.borrowedBooks.filter(id => id !== bookId);
  book.available = true;

  res.json({ message: `${user.name} returned ${book.title}`, user, book });
});

// --------------------------------
// PART B: PATH PARAMETERS
// --------------------------------

// 1️⃣ Fetch details about a specific book
app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// 2️⃣ Retrieve a specific user's borrowing history
app.get("/users/:id/history", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  const borrowed = user.borrowedBooks.map(bookId => books.find(b => b.id === bookId));
  res.json({ user: user.name, borrowedBooks: borrowed });
});

// --------------------------------
// Start the server
// --------------------------------
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
