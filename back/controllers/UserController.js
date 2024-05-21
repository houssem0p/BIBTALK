const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utility/config');
const blacklist = require('../utility/blacklist');
const upload = require('../utility/multerConfig');

const Book = require('../models/Book');


// Controller for creating a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for getting all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for getting a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for updating a user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for deleting a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for deleting all
exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for getting all superusers
exports.getSuperUsers = async (req, res) => {
    try {
      const superUsers = await User.find({ isSuperUser: true });
      res.status(200).json(superUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller for searching users by keyword
  exports.searchUsers = async (req, res) => {
    try {
      const keyword = req.params.keyword;
      const users = await User.find({
        $or: [
          { username: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
        ],
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.registerUser = async (req, res) => {
    try {
      const { username, email, password   } = req.body;
  
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      // Send a response back to the client
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  // Login endpoint
  exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email: email });
        if (!user) {
            return res.status(401).json({ error: 'Email does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
       
        // Generate JWT
        const token = jwt.sign({ user: { id: user._id, email: user.email ,isSuperUser: user.isSuperUser } }, config.secretKey);

        // Include the token and redirect URL in the response
        res.status(200).json({ token,user, redirectUrl: '/users/protected-data' });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.logoutUser = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (token) {
    // Add the token to the blacklist
    blacklist.add(token);
    res.json({ message: 'Logout successful' });
  } else {
    res.status(401).json({ error: 'No token provided' });
  }
};

exports.addToWishlist = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the authenticated user
  const bookId = req.params.bookId; // Assuming you have bookId as a parameter in your route

  try {
    // Find the user
    const user = await User.findById(userId);

    // Find the book
    const book = await Book.findById(bookId);
    // Check if both user and book exist
    if (!user || !book) {
      return res.status(404).json({ error: 'User or book not found' });
    }

    // Check if the book is already in the wishlist
    if (user.wishList.includes(bookId)) {
      return res.status(400).json({ error: 'Book already in wishlist' });
    }

    // Add the book to the wishlist
    user.wishList.push(bookId);

    // Save the user
    await user.save();

    res.status(200).json({ message: 'Book added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  // Controller for removing a book from the user's wishlist
  exports.removeFromWishlist = async (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;
  
    try {
      // Find the user
      const user = await User.findById(userId);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the book is in the wishlist
      const index = user.wishList.indexOf(bookId);
      if (index === -1) {
        return res.status(400).json({ error: 'Book not found in wishlist' });
      }
  
      // Remove the book from the wishlist
      user.wishList.splice(index, 1);
  
      // Save the user
      await user.save();
  
      res.status(200).json({ message: 'Book removed from wishlist successfully' });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.addToAlreadyRead = async (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;
  
    try {
      const user = await User.findById(userId);
      const book = await Book.findById(bookId);
  
      if (!user || !book) {
        return res.status(404).json({ error: 'User or book not found' });
      }
  
      if (user.alreadyRead.includes(bookId)) {
        return res.status(400).json({ error: 'Book already in Already Read list' });
      }
  
      user.alreadyRead.push(bookId);
      await user.save();
  
      res.status(200).json({ message: 'Book added to Already Read list successfully' });
    } catch (error) {
      console.error('Error adding to Already Read list:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  // Controller for adding a book to the "Have Been Read" list
  exports.addToHaveBeenRead = async (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;
  
    try {
      const user = await User.findById(userId);
      const book = await Book.findById(bookId);
  
      if (!user || !book) {
        return res.status(404).json({ error: 'User or book not found' });
      }
  
      if (user.haveBeenRead.includes(bookId)) {
        return res.status(400).json({ error: 'Book already in Have Been Read list' });
      }
  
      user.haveBeenRead.push(bookId);
      await user.save();
  
      res.status(200).json({ message: 'Book added to Have Been Read list successfully' });
    } catch (error) {
      console.error('Error adding to Have Been Read list:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.removeFromAlreadyRead = async (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the book is in the Already Read list
      if (!user.alreadyRead.includes(bookId)) {
        return res.status(400).json({ error: 'Book not in Already Read list' });
      }
  
      // Remove the book from the Already Read list
      user.alreadyRead = user.alreadyRead.filter((id) => id.toString() !== bookId);
      await user.save();
  
      res.status(200).json({ message: 'Book removed from Already Read list successfully' });
    } catch (error) {
      console.error('Error removing from Already Read list:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  // Controller for removing a book from the "Have Been Read" list
  exports.removeFromHaveBeenRead = async (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the book is in the Have Been Read list
      if (!user.haveBeenRead.includes(bookId)) {
        return res.status(400).json({ error: 'Book not in Have Been Read list' });
      }
  
      // Remove the book from the Have Been Read list
      user.haveBeenRead = user.haveBeenRead.filter((id) => id.toString() !== bookId);
      await user.save();
  
      res.status(200).json({ message: 'Book removed from Have Been Read list successfully' });
    } catch (error) {
      console.error('Error removing from Have Been Read list:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
// Controller for adding a rating and comment to a book
exports.addRatingAndComment = async (req, res) => {
  const userId = req.user.id; 

  const bookId = req.params.bookId;
  const { rating, comment } = req.body;

  try {
    // Find the user
    const user = await User.findById(userId);

    // Find the book
    const book = await Book.findById(bookId);

    // Check if both user and book exist
    if (!user || !book) {
      return res.status(404).json({ error: 'User or book not found' });
    }

    // Check if the user has already rated the book
    const existingReview = book.reviews.find(review => review.user.equals(userId));

    if (existingReview) {
      // User has already rated the book, add a new comment to existing review
      existingReview.comments.push(comment);
      existingReview.rating = rating;
    } else {
      // User hasn't rated the book yet, add a new review with the comment and rating
      book.reviews.push({
        user: userId,
        rating: rating,
        comments: [comment],
      });
    }

    // Save the book
    await book.save();

    res.status(200).json({ message: 'Rating and comment added successfully', book: book });
  } catch (error) {
    console.error('Error adding rating and comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for getting the average rating of a book by title
exports.getAverageRating = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const ratings = book.reviews.map((review) => review.rating).filter((rating) => rating !== undefined);

    if (ratings.length === 0) {
      return res.status(200).json({ averageRating: 0 });
    }

    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    const averageRating = sum / ratings.length;

    res.status(200).json({ averageRating });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for getting all comments of a book by ID
exports.getAllComments = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Extract comments from all reviews
    const allComments = book.reviews.reduce((acc, review) => {
      return acc.concat(review.comments);
    }, []);

    res.status(200).json({ comments: allComments });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageUrl = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'profileImage': imageUrl } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile image uploaded successfully', user: updatedUser });
  } catch (error) {
    console.error('Error handling profile image upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.submitBookRequest = async (req, res) => {
  try {
    const allowedCategories = ['Arts & Music','Biography','Business','Comics','Computer & Tech','Cooking','Crime','Drama','Education','Entertainment','Fiction','Health','History','Horror','Kids','Literature','Medical','Mystery','Religion','Romance','Science Fiction & Fantasy','Science & Math','Sports' , 'Romance', 'Travel','Thriller','Western', 'Other'];

    const { title, author, description, category , language , publishedDate } = req.body;
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Assuming you have Multer middleware configured and 'image' is the field name in the form data
    const coverImage = req.file.path; // This assumes Multer saves the file path in req.file.path

    const newBook = new Book({
      title,
      author,
      description,
      category,
      cover: coverImage,
      status: 'pending',
      language,
      publishedDate,
    });

    await newBook.save();
    res.status(201).json({ message: 'Book creation request submitted successfully' });
  } catch (error) {
    console.error('Error submitting book creation request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await Book.find({ status: 'pending' });

    res.status(200).json({ pendingRequests });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.approveOrRejectRequest = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { action } = req.body; // 'approve' ou 'reject'
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const updatedBook = await Book.findByIdAndUpdate(bookId, { status: newStatus }, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Request updated successfully', book: updatedBook });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 