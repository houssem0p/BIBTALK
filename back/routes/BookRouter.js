const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');
const { authenticateMiddleware, authAdminMiddleware } = require('../utility/auth');
const upload = require('../utility/multerConfig');

// Routes
router.get('/',authenticateMiddleware, BookController.getAllBooks);
router.get('/top-rated', authenticateMiddleware, BookController.getTopRatedBooks);
router.get('/popular', authenticateMiddleware, BookController.getPopularBooks);
router.get('/new', authenticateMiddleware, BookController.getNewBooks);
router.get('/:id',authenticateMiddleware, BookController.getBookById);
router.get('/anybook/:id',[authenticateMiddleware, authAdminMiddleware], BookController.getAnyBookById);
router.get('/bookList',authenticateMiddleware, BookController.getBooksByLists);
router.put('/update/:id', [authenticateMiddleware, authAdminMiddleware], upload.single('cover'), BookController.updateBook);
router.delete('/delete/:id', [authenticateMiddleware, authAdminMiddleware],BookController.deleteBook);
router.delete('/delete', [authenticateMiddleware, authAdminMiddleware],BookController.deleteAllBooks);

// Filter and Search Routes

router.get('/filter/category/:category',authenticateMiddleware, BookController.getBooksByCategory);
router.get('/search/:keyword',authenticateMiddleware, BookController.searchBooks);
router.post('/create', authenticateMiddleware, upload.single('cover'), BookController.createBook);


module.exports = router;    