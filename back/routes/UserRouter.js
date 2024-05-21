const express = require('express');
const router = express.Router();
const upload = require('../utility/multerConfig');

const userController = require('../controllers/UserController');
const { authenticateMiddleware, authAdminMiddleware }= require('../utility/auth');


// Routes
//router.post('/', userController.createUser);
router.get('/',[authenticateMiddleware, authAdminMiddleware], userController.getAllUsers);
router.put('/:id',authenticateMiddleware, userController.updateUser);
router.delete('/:id',[authenticateMiddleware, authAdminMiddleware] ,userController.deleteUser);
router.delete('/',[authenticateMiddleware, authAdminMiddleware], userController.deleteAllUsers);

router.get('/filter/superusers', [authenticateMiddleware, authAdminMiddleware],userController.getSuperUsers);
router.get('/search/:keyword', authenticateMiddleware,userController.searchUsers);
router.post('/register', userController.registerUser);

//lists
router.post('/wishlist/:bookId', authenticateMiddleware, userController.addToWishlist); //plane to read
router.delete('/wishlist/:bookId', authenticateMiddleware, userController.removeFromWishlist);
router.post('/alreadyread/:bookId', authenticateMiddleware, userController.addToAlreadyRead); // read
router.delete('/alreadyread/:bookId', authenticateMiddleware, userController.removeFromAlreadyRead);
router.post('/reading/:bookId', authenticateMiddleware, userController.addToHaveBeenRead); //reading
router.delete('/reading/:bookId', authenticateMiddleware, userController.removeFromHaveBeenRead);

// Login endpoint
router.post('/login', userController.loginUser);
router.post('/logout',authenticateMiddleware, userController.logoutUser);
router.post('/:bookId/rating-comment', authenticateMiddleware, userController.addRatingAndComment);
router.get('/:bookId/average-rating',authenticateMiddleware, userController.getAverageRating);
router.get('/:bookId/comments', authenticateMiddleware,userController.getAllComments);
router.post('/upload', authenticateMiddleware, upload.single('image'), userController.uploadProfileImage);

router.post('/submit-request', authenticateMiddleware,upload.single('cover'), userController.submitBookRequest);

// Route to get pending book creation requests (only accessible to admin users)
router.get('/pending-requests',[authenticateMiddleware, authAdminMiddleware], userController.getPendingRequests);

// Route to approve or reject a book creation request (only accessible to admin users)
router.put('/approve-reject-request/:bookId', [authenticateMiddleware, authAdminMiddleware], userController.approveOrRejectRequest);

module.exports = router;
// Protected route

router.get('/:id',authenticateMiddleware, userController.getUserById);

module.exports = router;