var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

// GET initial redirect
router.get('/', (req, res, next) => {
  res.redirect('/books');
})

/* GET all books */
router.get('/books', (req, res, next) => {
  Book.findAll()
  .then(books => {
    res.render('books/index', {books: books, title: "Books"})
  })
  .catch(err => {
    next(err);
  })
});

/* POST create book */
router.post('/books/new', (req, res, next) => {
  Book.create(req.body)
  .then(() => {
    res.redirect('/books')
  })
  .catch(err => {
    if(err.name == 'SequelizeValidationError'){
      res.render('books/new-book', {
        book: Book.build(req.body), 
        title: "New Book",
        errors: err.errors})
    }})
});

/* Create a new book form */
router.get('/books/new', (req, res, next) => {
  res.render('books/new-book', {book: Book.build(), title: "New Book"})
})

/* GET individual book */
router.get('/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
  .then(book => {
    if(book){
      res.render('books/update-book', {book: book, title: book.title})
    } else {
      const error = new Error();
      next(error);
    }
  })
})

/* POST update book */
router.post("/books/:id", (req, res, next) => {
  Book.findById(req.params.id)
  .then(book => {
    if(book){
      return book.update(req.body)
    } else {
      next(err);
    }
  }).then(() => {
    res.redirect(`/books`);
  })
  .catch(err => {
    if(err.name === "SequelizeValidationError"){
      let book = Book.build(req.body);
      book.id = req.params.id;

      res.render('books/update-book', {
        book: book, 
        title: "Update Book",
        errors: err.errors});
    } else {
      next(err);
    }
  });
});

/* POST delete book */
router.post('/books/:id/delete', (req, res, next) => {
  Book.findById(req.params.id)
  .then(book => {
    if(book){
      return book.destroy()
    } else {
      next(err);
    }
  })
  .then(() => {
    res.redirect('/books');
  })
  .catch(err => {
    next(err)
  });
});

module.exports = router;
