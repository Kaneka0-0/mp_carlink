# API Documentation

## Overview

This document provides detailed information about the APIs used in the MP CarLink application. The application primarily uses Firebase services for backend functionality, including authentication, database, and storage.

## Firebase Configuration

### Initialization

```typescript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
```

## Authentication API

### User Registration

```typescript
POST /api/auth/register

Request:
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

Response:
{
  "user": {
    "uid": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

### User Login

```typescript
POST /api/auth/login

Request:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "user": {
    "uid": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

## Vehicle Management API

### Get All Vehicles

```typescript
GET /api/vehicles

Response:
{
  "vehicles": [
    {
      "id": "vehicle-id",
      "make": "Toyota",
      "model": "Camry",
      "year": 2022,
      "price": 25000,
      "status": "available"
    }
  ]
}
```

### Get Vehicle by ID

```typescript
GET /api/vehicles/:id

Response:
{
  "id": "vehicle-id",
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "price": 25000,
  "status": "available",
  "details": {
    "mileage": 15000,
    "color": "Silver",
    "transmission": "Automatic"
  }
}
```

### Create Vehicle

```typescript
POST /api/vehicles

Request:
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "price": 25000,
  "details": {
    "mileage": 15000,
    "color": "Silver",
    "transmission": "Automatic"
  }
}

Response:
{
  "id": "vehicle-id",
  "status": "success"
}
```

## Selling Platform API

### Create Listing

```typescript
POST /api/sell/listing

Request:
{
  "vehicleId": "vehicle-id",
  "price": 25000,
  "description": "Excellent condition",
  "images": ["image-url-1", "image-url-2"]
}

Response:
{
  "listingId": "listing-id",
  "status": "active"
}
```

### Update Listing

```typescript
PUT /api/sell/listing/:id

Request:
{
  "price": 24000,
  "status": "sold"
}

Response:
{
  "status": "success"
}
```

## Dashboard API

### Get Analytics

```typescript
GET /api/dashboard/analytics

Response:
{
  "totalVehicles": 100,
  "availableVehicles": 75,
  "soldVehicles": 25,
  "revenue": 2500000,
  "monthlyStats": {
    "vehiclesAdded": 10,
    "vehiclesSold": 5,
    "revenue": 125000
  }
}
```

## AI Assistant API

### Get Vehicle Recommendations

```typescript
POST /api/ai/recommendations

Request:
{
  "preferences": {
    "budget": 30000,
    "make": ["Toyota", "Honda"],
    "type": "SUV"
  }
}

Response:
{
  "recommendations": [
    {
      "vehicleId": "vehicle-id",
      "matchScore": 0.95,
      "reason": "Matches budget and preferred make"
    }
  ]
}
```

## Auction API

### Create Auction

```typescript
POST /api/auctions

Request:
{
  "vehicleId": "vehicle-id",
  "startTime": "2024-04-01T10:00:00Z",
  "endTime": "2024-04-07T10:00:00Z",
  "reservePrice": 30000
}

Response:
{
  "auctionId": "auction-id",
  "status": "scheduled"
}
```

### Get Auction Details

```typescript
GET /api/auctions/:id

Response:
{
  "id": "auction-id",
  "vehicle": {
    "id": "vehicle-id",
    "make": "Toyota",
    "model": "Camry",
    "year": 2022,
    "image": "image-url"
  },
  "currentBid": 25000,
  "reservePrice": 30000,
  "startTime": "2024-04-01T10:00:00Z",
  "endTime": "2024-04-07T10:00:00Z",
  "status": "active",
  "bids": [
    {
      "amount": 25000,
      "bidder": "user-id",
      "timestamp": "2024-04-02T15:30:00Z"
    }
  ]
}
```

### Place Bid

```typescript
POST /api/auctions/:id/bids

Request:
{
  "amount": 26000
}

Response:
{
  "bidId": "bid-id",
  "status": "success"
}
```

### Set Auto-Bid

```typescript
POST /api/auctions/:id/auto-bid

Request:
{
  "maxBid": 35000
}

Response:
{
  "autoBidId": "auto-bid-id",
  "status": "active"
}
```

### Get Auction Notifications

```typescript
GET /api/auctions/notifications

Response:
{
  "notifications": [
    {
      "id": "notification-id",
      "type": "outbid",
      "message": "You have been outbid on Toyota Camry 2022",
      "timestamp": "2024-04-02T16:00:00Z",
      "read": false,
      "auctionId": "auction-id"
    }
  ]
}
```

### Mark Notification as Read

```typescript
PUT /api/auctions/notifications/:id/read

Response:
{
  "status": "success"
}
```

### Process Auction Payment

```typescript
POST /api/auctions/:id/payment

Request:
{
  "paymentMethodId": "payment-method-id",
  "amount": 26000
}

Response:
{
  "paymentId": "payment-id",
  "status": "completed"
}
```

### Get Auction History

```typescript
GET /api/auctions/history

Response:
{
  "auctions": [
    {
      "id": "auction-id",
      "vehicle": {
        "make": "Toyota",
        "model": "Camry",
        "year": 2022
      },
      "finalPrice": 32000,
      "endTime": "2024-04-07T10:00:00Z",
      "status": "completed"
    }
  ]
}
```

## Error Handling

All API endpoints return standardized error responses:

```typescript
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication required
- `INVALID_CREDENTIALS`: Invalid login credentials
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- Vehicle management: 60 requests per minute
- Dashboard analytics: 30 requests per minute
- AI recommendations: 20 requests per minute

## Security

1. All API endpoints require authentication unless specified otherwise
2. JWT tokens are used for authentication
3. Input validation is performed on all requests
4. CORS is enabled for specific origins
5. Rate limiting is implemented to prevent abuse

## Versioning

API versioning is handled through the URL path:
- Current version: `/api/v1/...`
- Future versions will use: `/api/v2/...`

## Testing

API endpoints can be tested using:
1. Postman collection
2. Swagger documentation
3. Automated tests in the test suite 