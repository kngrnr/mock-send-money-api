# Mock Send Money API

A mock money transfer API built with Node.js and Vercel, using JSONBin for data storage.

## Features

- User authentication with mock tokens
- Check wallet balance
- Send money between users
- View transaction history
- User login/logout

## Authentication

Authentication uses Bearer tokens in the format: `mock-token-{username}`

Example header:
```
Authorization: Bearer mock-token-king123
```

## Environment Variables

Create a `.env.local` file with:

```
JSONBIN_WALLETS_BIN_ID=your_wallets_bin_id
JSONBIN_TRANSACTIONS_BIN_ID=your_transactions_bin_id
JSONBIN_USERS_BIN_ID=your_users_bin_id
JSONBIN_API_KEY=your_jsonbin_api_key
```

## API Endpoints

### 1. Login

**POST** `/api/login`

Login with username and password to get an authentication token.

```bash
curl -X POST "https://mock-send-money-api.vercel.app/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "king123",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "mock-token-king123",
  "user": {
    "id": 1,
    "name": "King",
    "username": "king123"
  }
}
```

---

### 2. Get Balance

**GET** `/api/balance`

Retrieve the wallet balance for the authenticated user.

```bash
curl -X GET "https://mock-send-money-api.vercel.app/api/balance" \
  -H "Authorization: Bearer mock-token-king123"
```

**Response:**
```json
{
  "userId": 1,
  "userName": "king123",
  "balance": 395,
  "currency": "PHP"
}
```

---

### 3. Send Money

**POST** `/api/send`

Transfer money from the authenticated user to another user.

```bash
curl -X POST "https://mock-send-money-api.vercel.app/api/send" \
  -H "Authorization: Bearer mock-token-king123" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientUsername": "juan123",
    "amount": 50
  }'
```

**Response:**
```json
{
  "success": true,
  "senderBalance": 345
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `400 Bad Request` - Missing recipientUsername or amount, or insufficient balance
- `404 Not Found` - Sender or recipient wallet not found

---

### 4. Get Transactions

**GET** `/api/transactions`

Retrieve all transactions for the authenticated user.

```bash
curl -X GET "https://mock-send-money-api.vercel.app/api/transactions" \
  -H "Authorization: Bearer mock-token-king123"
```

**Response:**
```json
{
  "debug": {
    "username": "king123",
    "userWallet": {
      "userId": 1,
      "userName": "king123",
      "balance": 345,
      "currency": "PHP"
    },
    "totalTransactions": 5,
    "userIdLookingFor": 1,
    "sample_transactions": [...]
  },
  "transactions": [
    {
      "transactionId": 1,
      "userId": 1,
      "type": "credit",
      "amount": 500,
      "currency": "PHP",
      "description": "Deposit",
      "date": "2026-02-14"
    },
    {
      "transactionId": 3,
      "userId": 1,
      "type": "debit",
      "amount": 50,
      "description": "Sent to juan123",
      "date": "2026-02-16T10:30:45.123Z"
    }
  ]
}
```

---

### 5. Logout

**POST** `/api/logout`

Logout the authenticated user (currently a stub endpoint).

```bash
curl -X POST "https://mock-send-money-api.vercel.app/api/logout" \
  -H "Authorization: Bearer mock-token-king123"
```

**Response:**
```json
{
  "success": true
}
```

---

## Complete Workflow Example

### Step 1: Login
```bash
curl -X POST "https://mock-send-money-api.vercel.app/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "king123", "password": "password123"}'
```
Get token: `mock-token-king123`

### Step 2: Check Balance
```bash
curl -X GET "https://mock-send-money-api.vercel.app/api/balance" \
  -H "Authorization: Bearer mock-token-king123"
```

### Step 3: Send Money
```bash
curl -X POST "https://mock-send-money-api.vercel.app/api/send" \
  -H "Authorization: Bearer mock-token-king123" \
  -H "Content-Type: application/json" \
  -d '{"recipientUsername": "juan123", "amount": 50}'
```

### Step 4: View Transactions
```bash
curl -X GET "https://mock-send-money-api.vercel.app/api/transactions" \
  -H "Authorization: Bearer mock-token-king123"
```

### Step 5: Logout
```bash
curl -X POST "https://mock-send-money-api.vercel.app/api/logout" \
  -H "Authorization: Bearer mock-token-king123"
```

---

## Data Structure

### Wallets
```json
{
  "userId": 1,
  "userName": "king123",
  "balance": 395,
  "currency": "PHP"
}
```

### Transactions
```json
{
  "transactionId": 1,
  "userId": 1,
  "type": "debit|credit",
  "amount": 50,
  "currency": "PHP",
  "description": "Transaction description",
  "date": "2026-02-16T10:30:45.123Z"
}
```

### Users
```json
{
  "id": 1,
  "username": "king123",
  "password": "password123",
  "name": "King"
}
```

---

## Development

### Local Testing

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`

3. Run locally:
```bash
vercel dev
```

### Deployment

Deploy to Vercel:
```bash
vercel --prod
```

---

## Error Handling

All errors return appropriate HTTP status codes:

- `400 Bad Request` - Missing or invalid parameters
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - Wrong HTTP method
- `500 Server Error` - Internal server error

---

## Notes

- All monetary amounts are in the specified currency (PHP)
- Tokens use username format: `mock-token-{username}`
- Transactions automatically create both debit and credit records
- Each send money operation increments transaction IDs sequentially
- Deployed using Vercel
