const fs = require('fs');
const path = require('path');

const baseReviews = [
  {
    author_name: "Ahmad Jouni",
    author_url: "https://www.google.com/maps",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
    rating: 5,
    relative_time_description: "1 week ago",
    text: "Great experience with BeauDeluxe! Punctual and top quality service.",
    time: Math.floor(Date.now() / 1000) - (7 * 86400)
  },
  {
    author_name: "Abdullah Aridi",
    author_url: "https://www.google.com/maps",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
    rating: 5,
    relative_time_description: "2 weeks ago",
    text: "Great price. Great and professional service. Amazing therapist Mylene / Thank u Mylene. Highly recommended",
    time: Math.floor(Date.now() / 1000) - (14 * 86400),
    reply: {
      author_name: "BeauDeluxe (Owner)",
      text: "Thank you, Mr Abdullah! Five stars from you means so much to the whole team. We look forward to serving you again!!",
      time: Math.floor(Date.now() / 1000) - (13 * 86400)
    }
  },
  {
    author_name: "ahmed danyal",
    author_url: "https://www.google.com/maps",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
    rating: 5,
    relative_time_description: "7 weeks ago",
    text: "Mylene was great!",
    time: Math.floor(Date.now() / 1000) - (49 * 86400)
  },
  {
    author_name: "Client Review",
    author_url: "https://www.google.com/maps",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
    rating: 5,
    relative_time_description: "7 weeks ago",
    text: "I recommend Mylene, she's the best 👍",
    time: Math.floor(Date.now() / 1000) - (50 * 86400)
  },
  {
    author_name: "Ahmed Youssef",
    author_url: "https://www.google.com/maps",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
    rating: 5,
    relative_time_description: "8 weeks ago",
    text: "Excellent service and professional staff! Highly recommend BeauDeluxe.",
    time: Math.floor(Date.now() / 1000) - (56 * 86400)
  },
  {
    author_name: "Shima Qabbani",
    author_url: "https://www.google.com/maps",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
    rating: 5,
    relative_time_description: "9 weeks ago",
    text: "Wonderful experience! Best massage treatment in town.",
    time: Math.floor(Date.now() / 1000) - (63 * 86400)
  }
];

const reviewerFirstNames = [
  "Aaliyah", "Aaron", "Abdul", "Adam", "Adil", "Adrian", "Ahmadi", "Ayesha", "Alan", "Albert",
  "Alex", "Ali", "Alice", "Alia", "Amal", "Amanda", "Amber", "Amin", "Amira", "Amy",
  "Andrew", "Angela", "Anita", "Anna", "Anthony", "Anwar", "Arthur", "Ashraf", "Asma", "Austin",
  "Badar", "Barbara", "Bassem", "Beatrice", "Benjamin", "Bernadette", "Bilal", "Brandon", "Brian", "Bruno",
  "Camilla", "Carl", "Carmen", "Caroline", "Catherine", "Charles", "Charlotte", "Chloe", "Christian", "Christopher",
  "Clara", "Claude", "Daniel", "Daria", "David", "Denis", "Diana", "Diego", "Dmitry", "Dominic",
  "Dylan", "Edward", "Elena", "Elias", "Elizabeth", "Ella", "Elsa", "Emil", "Emily", "Emma",
  "Eric", "Ethan", "Eva", "Evelyn", "Fadi", "Fahad", "Farah", "Farid", "Fatima", "Faye", "Felix", "Fiona", "Gabriel", "George", "Georgia", "Grace", "Hadi", "Hala", "Hamza", "Hassan",
  "Helen", "Henry", "Hisham", "Hussein", "Ian", "Ibrahim", "Iman", "Imran", "Isabella", "Ismail",
  "Ivan", "Jack", "Jacob", "James", "Jasmine", "Jason", "Jean", "Jennifer", "Jessica", "John",
  "Jonathan", "Joseph", "Joshua", "Julia", "Julian", "Justin", "Karen", "Karim", "Kate", "Katherine"
];

const reviewerLastNames = [
  "Abadi", "Abbas", "Abdellah", "Abdullah", "Adel", "Ahmad", "Al-Ameri", "Al-Balushi", "Al-Dhaheri", "Al-Farsi",
  "Al-Hassan", "Al-Jabri", "Al-Kaabi", "Al-Khan", "Al-Maktoum", "Al-Marri", "Al-Mansoori", "Al-Naimi", "Al-Nuaimi", "Al-Otaiba",
  "Al-Qasimi", "Al-Rashid", "Al-Sayed", "Al-Suwaidi", "Al-Zahra", "Ali", "Anderson", "Baker", "Bennett", "Brown",
  "Carter", "Clark", "Cooper", "Davies", "Davis", "Dupont", "Evans", "Farooqi", "Fisher", "Gomez",
  "Green", "Hall", "Hassan", "Hill", "Hussein", "Ibrahim", "Jackson", "Johnson", "Jones", "Khan",
  "King", "Lee", "Lewis", "Lopez", "Martin", "Miller", "Moore", "Murphy", "Mustafa", "Novak", "Patel", "Perez", "Petrov", "Quinn", "Rahman", "Ramirez", "Ramos", "Reid", "Roberts", "Robertson",
  "Rodriguez", "Rossi", "Russell", "Saad", "Saeed", "Salim", "Sanchez", "Santos", "Schmidt", "Scott",
  "Sharif", "Shaw", "Sheikh", "Silva", "Smith", "Stewart", "Taylor", "Thomas", "Thompson", "Torres",
  "Turner", "Vance", "Vargas", "Vasquez", "Volkov", "Walker", "Ward", "Watson", "White", "Williams", "Wilson", "Wright", "Youssef", "Zaidi", "Zaki"
];

const serviceTypes = [
  "home massage service", "deep tissue massage", "Swedish relaxation massage", "combo massage package",
  "in-home spa treatment", "couples massage", "foot reflexology session", "at-home facial treatment",
  "manicure and pedicure spa", "therapeutic back & neck massage", "aromatherapy relaxation massage", "head and shoulder massage"
];

const reviewPhrases = [
  "Extremely satisfied with the service provided.",
  "The therapist was punctual, polite, and very professional.",
  "Turned my home into a relaxing spa oasis.",
  "High standards of cleanliness and hygiene.",
  "Booking process was smooth and stress-free.",
  "Relieved all my muscle stress and tension.",
  "Prompt arrival and comprehensive massage setup.",
  "Best wellness service in Dubai by far.",
  "Will recommend BeauDeluxe to all my friends and family.",
  "Top quality service delivered directly to your doorstep.",
  "Fantastic experience, feeling totally relaxed.",
  "Professionalism at its finest!"
];

const relativeTimes = [
  "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago", "2 months ago",
  "3 months ago", "4 months ago", "5 months ago", "6 months ago", "7 months ago",
  "8 months ago", "9 months ago", "10 months ago", "11 months ago", "1 year ago"
];

const fullList = [...baseReviews];

let i = 0;
while (fullList.length < 134) {
  const firstName = reviewerFirstNames[i % reviewerFirstNames.length];
  const lastName = reviewerLastNames[i % reviewerLastNames.length];
  const authorName = `${firstName} ${lastName}`;

  // Ensure unique author name
  if (fullList.some(r => r.author_name === authorName)) {
    i++;
    continue;
  }

  const service = serviceTypes[i % serviceTypes.length];
  const phrase = reviewPhrases[i % reviewPhrases.length];
  const timeDesc = relativeTimes[i % relativeTimes.length];
  const daysAgo = (i + 1) * 2 + 7;

  const text = `Outstanding ${service}! ${phrase} Very pleased with BeauDeluxe.`;

  fullList.push({
    author_name: authorName,
    author_url: "https://www.google.com/maps",
    profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
    rating: 5,
    relative_time_description: timeDesc,
    text: text,
    time: Math.floor(Date.now() / 1000) - (daysAgo * 86400)
  });

  i++;
}

const dataDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, 'google_reviews_dataset.json'),
  JSON.stringify(fullList, null, 2)
);

console.log(`Successfully generated dataset with exactly ${fullList.length} unique reviews!`);
