require('dotenv').config()
// console.log(process.env)

{
  "development": {
    "username": process.env.USER,
    "password": process.env.PASSWORD,
    "database": process.env.DB,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.USER,
    "password": process.env.PASSWORD,
    "database": process.env.DB,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.USER,
    "password": process.env.PASSWORD,
    "database": process.env.DB,
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
