const coursesData = [
  {
    title: "Introduction to Programming",
    description:
      "Learn the basics of programming with this introductory course.",
    category: "Programming",
    lectures: [
      {
        title: "Getting Started with Programming",
        description: "An overview of programming concepts and tools.",
        thumbnail: {
          public_id: "lecture1_public_id",
          secure_url: "lecture1_secure_url",
        },
      },
    ],
    thumbnail: {
      public_id: "intro_programming_thumbnail_public_id",
      secure_url: "intro_programming_thumbnail_secure_url",
    },
    numberOfLectures: 5,
    createdBy: "John Doe",
  },
  {
    title: "Web Development Basics",
    description:
      "Explore the fundamentals of web development in this hands-on course.",
    category: "Web Development",
    lectures: [
      {
        title: "HTML and CSS Fundamentals part 1",
        description: "Learn the basics of HTML and CSS for web development.",
        lecture: {
          public_id: "lecture2_public_id",
          secure_url: "lecture2_secure_url",
        },
      },
      {
        title: "HTML and CSS Fundamentals part 2",
        description: "Learn the basics of HTML and CSS for web development.",
        lecture: {
          public_id: "lecture2_public_id",
          secure_url: "lecture2_secure_url",
        },
      },
      {
        title: "HTML and CSS Fundamentals part 3",
        description: "Learn the basics of HTML and CSS for web development.",
        lecture: {
          public_id: "lecture2_public_id",
          secure_url: "lecture2_secure_url",
        },
      },
      {
        title: "HTML and CSS Fundamentals part 4",
        description: "Learn the basics of HTML and CSS for web development.",
        lecture: {
          public_id: "lecture2_public_id",
          secure_url: "lecture2_secure_url",
        },
      },
    ],
    thumbnail: {
      public_id: "web_dev_basics_thumbnail_public_id",
      secure_url: "web_dev_basics_thumbnail_secure_url",
    },
    numberOfLectures: 4,
    createdBy: "akshay jain",
  },
  {
    title: "Data Science Essentials",
    description:
      "Dive into the world of data science and analytics with this essential course.",
    category: "Data Science",
    lectures: [
      {
        title: "Introduction to Data Science part-1",
        description: "An overview of data science principles and techniques.",
        lecture: {
          public_id: "lecture3_public_id",
          secure_url: "lecture3_secure_url",
        },
      },
      {
        title: "Introduction to Data Science part-2",
        description: "An overview of data science principles and techniques.",
        thumbnail: {
          public_id: "lecture3_public_id",
          secure_url: "lecture3_secure_url",
        },
      },
      
    ],
    thumbnail: {
      public_id: "data_science_essentials_thumbnail_public_id",
      secure_url: "data_science_essentials_thumbnail_secure_url",
    },
    numberOfLectures: 2,
    createdBy: "Alex Johnson",
  },
];

// You can use this data to insert documents into MongoDB Atlas
