# Vynk 🚀

Vynk is a MERN-stack customer portal built using React, Express, and MongoDB. It currently supports customer authentication, protected routes, and basic profile management.

> 🚧 Currently under development.

## ✨ Features

- Customer signup and login
- JWT authentication with HTTP-only cookies
- Protected routes
- Customer profile retrieval
- Logout functionality
- Authentication state management using React Context
- Password hashing with bcrypt
- MongoDB database integration

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, React Router, Axios, Tailwind CSS

**Backend:** Node.js, Express 5, MongoDB, Mongoose, JWT, bcrypt, dotenv, cookie-parser

## 📁 Project Structure

```text
Vynk/
├── client/
│   └── src/
│       ├── axiosCalls/
│       ├── components/
│       ├── context/
│       ├── Pages/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
└── server/
    ├── controllers/
    ├── middlewares/
    ├── model/
    ├── routes/
    ├── utils/
    └── index.js
```

## 🌐 Application Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Customer login |
| `/signup` | Customer registration |
| `/home` | Protected customer page |

## 🔌 API Endpoints

The backend runs on port `9001`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/customer/register` | Register a customer |
| POST | `/customer/login` | Login |
| GET | `/customer/me` | Get customer profile |
| POST | `/customer/logout` | Logout |

## 🔐 Authentication

Vynk uses JWT authentication with HTTP-only cookies. Passwords are hashed using bcrypt, and protected routes ensure that only authenticated users can access restricted pages.

## 🚧 Future Improvements

- Add more customer portal features
- Improve validation and error handling
- Add automated tests
- Deploy the application
- Improve security

## 👨‍💻 Author

**Shreya Jadhav**

---

**Vynk — Still building. 🚀**
