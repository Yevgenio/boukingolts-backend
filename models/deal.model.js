const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number, // { type: Number, required: true },
  category: String,
  imagePath: {type: String, default: "default"},
  barcodePath: {type: String, default: "default"},
  stock: Number, //{ type: Number, required: true },
  startsAt: { type: Date, default: Date.now }, 
  endsAt: Date, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Deal', dealSchema);

// [
//   {
//     "name": "הנחה על קפה",
//     "description": "הנחה של 20% על כל משקאות הקפה בבתי הקפה השותפים שלנו.",
//     "price": 15,
//     "category": "אוכל ומשקאות",
//     "imageUrl": "https://example.com/images/coffee_discount.jpg",
//     "stock": 100,
//     "startsAt": "2024-11-01T00:00:00Z",
//     "endsAt": "2024-12-31T23:59:59Z",
//     "createdAt": "2024-11-01T10:00:00Z"
//   },
//   {
//     "name": "הנחה על מנוי לחדר כושר",
//     "description": "50% הנחה על מנויים שנתיים לחדר כושר.",
//     "price": 200,
//     "category": "כושר",
//     "imageUrl": "https://example.com/images/gym_discount.jpg",
//     "stock": 50,
//     "startsAt": "2024-11-05T00:00:00Z",
//     "endsAt": "2025-01-01T00:00:00Z",
//     "createdAt": "2024-11-05T08:00:00Z"
//   },
//   {
//     "name": "ארוחה זוגית במחיר מיוחד",
//     "description": "ארוחה זוגית במסעדות המשתתפות ב-100 ש\"ח בלבד.",
//     "price": 100,
//     "category": "אוכל",
//     "imageUrl": "https://example.com/images/dinner_discount.jpg",
//     "stock": 30,
//     "startsAt": "2024-11-10T00:00:00Z",
//     "endsAt": "2024-12-10T23:59:59Z",
//     "createdAt": "2024-11-10T09:00:00Z"
//   },
//   {
//     "name": "20% הנחה על מוצרי קוסמטיקה",
//     "description": "הנחה על כל מוצרי הקוסמטיקה המשתתפים במבצע.",
//     "price": 50,
//     "category": "קוסמטיקה",
//     "imageUrl": "https://example.com/images/cosmetics_discount.jpg",
//     "stock": 80,
//     "startsAt": "2024-11-15T00:00:00Z",
//     "endsAt": "2025-01-15T23:59:59Z",
//     "createdAt": "2024-11-15T11:00:00Z"
//   },
//   {
//     "name": "סדנת יוגה חינם",
//     "description": "הצטרפו לסדנת יוגה חינם בסוף השבוע.",
//     "price": 0,
//     "category": "כושר",
//     "imageUrl": "https://example.com/images/yoga_workshop.jpg",
//     "stock": 25,
//     "startsAt": "2024-11-20T00:00:00Z",
//     "endsAt": "2024-11-21T00:00:00Z",
//     "createdAt": "2024-11-10T12:00:00Z"
//   },
//   {
//     "name": "הנחה על טיפולי עיסוי",
//     "description": "10% הנחה על כל טיפולי העיסוי בספא.",
//     "price": 150,
//     "category": "בריאות",
//     "imageUrl": "https://example.com/images/massage_discount.jpg",
//     "stock": 40,
//     "startsAt": "2024-11-01T00:00:00Z",
//     "endsAt": "2024-12-31T23:59:59Z",
//     "createdAt": "2024-11-01T10:30:00Z"
//   },
//   {
//     "name": "50% הנחה על כרטיסים לסרטים",
//     "description": "50% הנחה על כרטיסים לסרטים בקולנוע המשתתף.",
//     "price": 25,
//     "category": "בידור",
//     "imageUrl": "https://example.com/images/movie_discount.jpg",
//     "stock": 150,
//     "startsAt": "2024-11-01T00:00:00Z",
//     "endsAt": "2024-12-15T23:59:59Z",
//     "createdAt": "2024-11-01T11:00:00Z"
//   },
//   {
//     "name": "כרטיס כניסה למוזיאון חינם",
//     "description": "כניסה חינם למוזיאון בשעות הבוקר.",
//     "price": 0,
//     "category": "תרבות",
//     "imageUrl": "https://example.com/images/museum_entry.jpg",
//     "stock": 60,
//     "startsAt": "2024-11-05T00:00:00Z",
//     "endsAt": "2024-12-05T23:59:59Z",
//     "createdAt": "2024-11-05T10:00:00Z"
//   },
//   {
//     "name": "הנחה על שיעורי גיטרה",
//     "description": "קבלו שיעור גיטרה ראשון ב-30% הנחה.",
//     "price": 70,
//     "category": "מוזיקה",
//     "imageUrl": "https://example.com/images/guitar_lesson.jpg",
//     "stock": 20,
//     "startsAt": "2024-11-07T00:00:00Z",
//     "endsAt": "2024-12-31T23:59:59Z",
//     "createdAt": "2024-11-07T09:00:00Z"
//   },
//   {
//     "name": "הנחה על שיעורי נהיגה",
//     "description": "10% הנחה על שיעורי נהיגה ראשונים.",
//     "price": 200,
//     "category": "לימודים",
//     "imageUrl": "https://example.com/images/driving_lessons.jpg",
//     "stock": 10,
//     "startsAt": "2024-11-15T00:00:00Z",
//     "endsAt": "2025-01-15T23:59:59Z",
//     "createdAt": "2024-11-15T08:00:00Z"
//   }
// ]
