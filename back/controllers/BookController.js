const Book = require('../models/Book');
const upload = require('../utility/multerConfig');
const path = require('path');
const fs = require('fs');

// Controller for creating a new book

exports.createBook = async (req, res) => {
  try {
    const allowedCategories = ['Arts & Music','Biography','Business','Comics','Computer & Tech','Cooking','Crime','Drama','Education','Entertainment','Fiction','Health','History','Horror','Kids','Literature','Medical','Mystery','Religion','Romance','Science Fiction & Fantasy','Science & Math','Sports' , 'Romance', 'Travel','Thriller','Western', 'Other'];

    const { title, author, description, category , language , publishedDate } = req.body;

    // Vérifie si la catégorie est autorisée
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const coverImagePath = req.file.path;

    const newBook = new Book({
      title,
      author,
      description,
      category,
      language,
      publishedDate,
      cover: coverImagePath,
      status: 'approved',
    });

    await newBook.save();

    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for getting all books
exports.getAllBooks = async (req, res) => {
  try {
    const approvedBooks = await Book.find({ status: 'approved' });
    res.status(200).json(approvedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBooksByLists = async (req, res ) => {
  const { bookIds } = req.query;
  console.log('Received bookIds:', bookIds);

  try {
    // Convert each string in the array to a valid ObjectId
    const objectIdArray = bookIds.map((id) => mongoose.Types.ObjectId(id));
    console.log('Converted objectIdArray:', objectIdArray);

    // Find books based on the converted ObjectId array
    const books = await Book.find({ _id: { $in: objectIdArray } });

    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books by IDs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for getting top-rated books
exports.getTopRatedBooks = async (req, res) => {
  try {
    const topRatedBooks = await Book.find({ status: 'approved' })
      .limit(8);
    res.status(200).json(topRatedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for getting popular books
exports.getPopularBooks = async (req, res) => {
  try {
    const popularBooks = await Book.find({ status: 'approved' })
      .sort({ '__v': -1 }) // Sort in descending order based on the number of reviews
      .limit(8); // Adjust the limit as needed
    res.status(200).json(popularBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for getting new books
exports.getNewBooks = async (req, res) => {
  try {
    const newBooks = await Book.find({ status: 'approved' })
      .sort({ publishedDate: -1 }) // Sort in descending order based on creation date
      .limit(8); // Adjust the limit as needed
    res.status(200).json(newBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller for getting a specific approved book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, status: 'approved' });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found or not approved' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnyBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id});
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Controller for updating a book by ID
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updateData = req.body;
    // Récupérer le livre existant de la base de données
    const existingBook = await Book.findById(bookId);

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Vérifier si la mise à jour concerne la couverture
    if (req.file) {
      // Si une nouvelle couverture est fournie, mettre à jour le chemin de la couverture
      updateData.cover = req.file.path;

      // Si une ancienne couverture existe, supprimez-la du système de fichiers
      if (existingBook.cover && existingBook.cover !== updateData.cover) {
        try {
          // Construisez le chemin complet du fichier de l'ancienne couverture
          const oldCoverPath = path.join(__dirname, '..', existingBook.cover);

          // Supprimez le fichier de l'ancienne couverture
          fs.unlinkSync(oldCoverPath);

          console.log('Old cover deleted successfully');
        } catch (error) {
          console.error('Error deleting old cover:', error);
        }
      }
    }

    // Mettez à jour le livre dans la base de données
    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Controller for deleting a book by ID
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(deletedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getBooksByCategory = async (req, res) => {
    try {
      const category = req.params.category;
      const books = await Book.find({ category , status: 'approved'});
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Controller for searching books by keyword
  exports.searchBooks = async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const books = await Book.find({
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: 'i' } },
                        { author: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } },
                        { category: { $regex: keyword, $options: 'i' } },
                    ],
                },
                { status: 'approved' }, // Additional condition for approved books
            ],
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


  // Controller for getting the average rating of a book by title
  exports.getAverageRating = async (req, res) => {
    const { id } = req.params;
  
    try {
      const book = await Book.findById(id);
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      const ratings = book.rating || [];
  
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
  // Controller for deleting all books
exports.deleteAllBooks = async (req, res) => {
  try {
    await Book.deleteMany({});
    res.status(200).json({ message: 'All books deleted successfully' });
  } catch (error) {
    console.error('Error deleting all books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
