//group by status and count how many books each status has
db.books.aggregate([
  {
    $group: {
      _id: "$status",
      number_of_books: { $sum: 1 },
    },
  },
]);

db.books.aggregate([
  {
    $group: {
      _id: "$status",
      avg_books_pages: { $avg: "$pageCount" },
    },
  },
]);

//group by status and count how many books each status has
db.books.aggregate([
  {
    $group: {
      _id: "$status",
      number_of_books: { $sum: "$pageCount" },
    },
  },
]);

db.books.aggregate([
  {
    $group: {
      _id: "$status",
      number_of_books: { $min: "$pageCount" },
    },
  },
]);

db.books.aggregate([
  {
    $group: {
      _id: "$status",
      number_of_books: { $sum: 1 },
      avg_books_pages: { $avg: "$pageCount" },
      total_pages: { $sum: "$pageCount" },
      min_pages: { $min: "$pageCount" },
      max_pages: { $max: "$pageCount" },
    },
  },
]);

//filter out books with 0 pages
//group by status and count how match books each status has
db.books.aggregate([
  {
    $match: { pageCount: { $gt: 0 } },
  },
  {
    $group: {
      _id: "$status",
      number_of_books: { $sum: 1 },
      avg_books_pages: { $avg: "$pageCount" },
      total_pages: { $sum: "$pageCount" },
      min_pages: { $min: "$pageCount" },
      max_pages: { $max: "$pageCount" },
    },
  },
]);

//filter out books with more then 0 pages
//group by status and count how match books each status has
db.books.aggregate([
  {
    $match: { pageCount: 0 },
  },
  {
    $group: {
      _id: "$status",
      number_of_books: { $sum: 1 },
      avg_books_pages: { $avg: "$pageCount" },
      total_pages: { $sum: "$pageCount" },
      min_pages: { $min: "$pageCount" },
      max_pages: { $max: "$pageCount" },
    },
  },
]);

//filter out books with more then 0 pages
//group by status and count how match books each status has
//sort by _id(status)
db.books.aggregate([
  {
    $match: { pageCount: 0 },
  },
  {
    $group: {
      _id: "$status",
      number_of_books: { $sum: 1 },
      avg_books_pages: { $avg: "$pageCount" },
      total_pages: { $sum: "$pageCount" },
      min_pages: { $min: "$pageCount" },
      max_pages: { $max: "$pageCount" },
    },
  },
  {
    $sort: { _id: 1 },
  },
]);

//concat first and last name
db.users.aggregate([
  {
    $project: {
      _id: 0,
      fullname: {
        $concat: ["$firstname", " ", "$lastname"],
      },
    },
  },
]);

//concat first and last name, all caps
db.users.aggregate([
  {
    $project: {
      _id: 0,
      fullname: {
        $concat: [{ $toUpper: "$firstname" }, " ", { $toUpper: "$lastname" }],
      },
    },
  },
]);

//concat first and last name, only the first letter will be caps
db.users.aggregate([
  {
    $project: {
      _id: 0,
      fullname: {
        $concat: [
          { $toUpper: { $substrCP: ["$firstname", 0, 1] } },
          {
            $substrCP: [
              "$firstname",
              1,
              {
                $subtract: [{ $strLenCP: "$firstname" }, 1],
              },
            ],
          },
          " ",
          { $toUpper: { $substrCP: ["$lastname", 0, 1] } },
          {
            $substrCP: [
              "$lastname",
              1,
              {
                $subtract: [{ $strLenCP: "$lastname" }, 1],
              },
            ],
          },
        ],
      },
      email: 1,
    },
  },
]);

//convert string-date to date

db.users.aggregate([
  {
    $project: {
      _id: 0,
      firstname: 1,
      lastname: 1,
      birthDate: {
        $convert: {
          input: "$dob",
          to: "date",
          onError: "this is not a number",
          onNull: "this field is not defined",
        },
      },
    },
  },
]);

//distruct authors array and duplicate the document
db.books.aggregate([{ $unwind: "$authors" }]);

//distruct authors array and duplicate the document
//pudh all the authors to array (with duplicates)
db.books.aggregate([
  { $unwind: "$authors" },
  {
    $group: {
      _id: "$affiliated",
      allAuthors: { $push: "$authors" },
    },
  },
]);

//distruct authors array and duplicate the document
//pudh all the authors to array (without duplicates)
//show only the aothers array
db.books.aggregate([
  { $unwind: "$authors" },
  {
    $group: {
      _id: "$affiliated",
      allAuthors: { $addToSet: "$authors" },
    },
  },
  {
    $project: {
      _id: 0,
      allAuthors: 1,
    },
  },
]);

//distruct authors array and duplicate the document
//pudh all the authors to array (without duplicates)
//show only the aothers array
//count authers
//show top 10 authors
db.books.aggregate([
  { $unwind: "$authors" },
  {
    $group: {
      _id: "$affiliated",
      allAuthors: { $addToSet: "$authors" },
    },
  },
  {
    $project: {
      _id: 0,
      authorsLength: { $size: "$allAuthors" },
      top10Authores: { $slice: ["$allAuthors", 0, 10] },
    },
  },
]);

//extcard year from date
db.books.aggregate([
  {
    $project: {
      title: 1,
      year: { $year: "$publishedDate" },
    },
  },
]);

//extcard year from date
db.books.aggregate([
  {
    $project: {
      title: 1,
      year: { $year: "$publishedDate" },
    },
  },
  {
    $match: { year: 2008 },
  },
]);

//find all published books
//get all categories from this books (no duplicate)
//count categories
db.books.aggregate([
  {
    $match: { status: "PUBLISH" },
  },
  {
    $unwind: "$categories",
  },
  {
    $match: {
      categories: { $ne: "" },
    },
  },
  {
    $group: {
      _id: "status",
      allCategories: { $addToSet: "$categories" },
    },
  },
  {
    $project: {
      categoriesLength: { $size: "$allCategories" },
    },
  },
]);

//concat first and last name, only the first letter will be caps
db.users.aggregate([
  {
    $project: {
      _id: 0,
      fullname: {
        $concat: [
          { $toUpper: { $substrCP: ["$firstname", 0, 1] } },
          {
            $substrCP: [
              "$firstname",
              1,
              {
                $subtract: [{ $strLenCP: "$firstname" }, 1],
              },
            ],
          },
          " ",
          { $toUpper: { $substrCP: ["$lastname", 0, 1] } },
          {
            $substrCP: [
              "$lastname",
              1,
              {
                $subtract: [{ $strLenCP: "$lastname" }, 1],
              },
            ],
          },
        ],
      },
      email: 1,
    },
  },
]);

//extcard year from date
//save it to new collection
db.books.aggregate([
  {
    $project: {
      title: 1,
      year: { $year: "$publishedDate" },
    },
  },
  {
    $match: { year: 2008 },
  },
  {
    $out: "publishedBooksOf2008",
  },
]);
