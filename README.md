# School Management API

A REST API for managing school data with proximity-based retrieval.

## Prerequisites

- Node.js 18+
- MySQL 8.0+

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MySQL credentials

4. Build and start:
   ```bash
   npm run build
   npm start
   ```

## Endpoints

### Add School
```
POST /api/schools/addSchool
Content-Type: application/json

{
  "name": "Springfield High",
  "address": "123 Main St",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### List Schools (sorted by distance)
```
GET /api/schools/listSchools?latitude=40.7128&longitude=-74.0060
```

## Development

```bash
npm run dev
```