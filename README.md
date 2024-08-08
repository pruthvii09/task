
# Inventory Application API Documentation

#### Base URL
All API requests should be made to `http://localhost:4000/`

## Installation

#### Prerequisites
Make sure you have Node.js and npm installed
#### Clone Repository
```bash
  git clone https://github.com/pruthvii09/task.git
  cd task
```
#### Install Node Modules
```bash
  npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`
`REDIS_URI`
`PORT`

## Table of Content
Route | Description 
--- | --- | 
Items | POST, PUT, GET, DELETE
Bill | POST, PUT, GET, DELETE

    
## Items

#### Add Item

```http
  POST /items
```
##### Body
```
{
    "name": "Keyboard",
    "description": "Computer Keyboard",
    "price": 400000,
    "quantity": 100
}
```

#### Get all Items

```http
  GET /items
```
#### Update Item

```http
  PUT /items/:id
```

## Bill

#### Create Bill
```http
  POST /bills
```
##### Body
```
{
  "phoneNumber": "1234567890",
  "items": [
    {
      "itemId": "66b473d6a633399715a4ec52",
      "quantity": 200
    }
  ]
}
```
#### Get all Bills
```http
  GET /bills
```
#### Get single bill

```http
  POST /bills.:id
```
