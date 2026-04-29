# Smart Parking OS Frontend

React + Vite frontend for the parking management system.

## Current State

- The app is already connected to the backend through `axios`
- User flows for bookings, monthly passes, payments, and admin pages use real API calls
- VNPay sandbox is supported for:
  - booking creation
  - monthly pass purchase
  - monthly pass renewal

## VNPay Frontend Flow

1. The frontend submits a booking or monthly pass request with `"paymentMethod": "VNPAY"`
2. The backend responds with a `paymentUrl`
3. The frontend redirects the browser to VNPay sandbox
4. VNPay returns the user to `/payments/vnpay-return`
5. The frontend verifies that return payload through the backend public endpoint `GET /api/payments/vnpay-return`
6. The user sees the payment result page and can navigate back to payments, bookings, or passes

## Environment

Create your local `.env` with:

```bash
VITE_API_URL=http://localhost:3000/api
```

The backend should use a VNPay return URL that points back to this frontend page:

```bash
VNPAY_RETURN_URL=http://localhost:5173/payments/vnpay-return
```

## Scripts

```bash
npm install
npm run dev
npm run build
```
