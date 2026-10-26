# Flock Energy API

A REST API wrapper built with **Node.js, Express.js, and Axios** for interacting with the Urja Meter Ops portal.

The API provides endpoints to search meters and retrieve meter details, geographical location, and energy consumption data.

## Tech Stack

- Node.js
- Express.js
- Axios
- dotenv

## Project Structure

```text
flock-energy-api/
├── app.js
├── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── src/
    ├── config/
    ├── middleware/
    ├── models/
    ├── routes/
    │   └── meters.js
    └── services/
        └── urjaClient.js
```

## Prerequisites

- Node.js
- npm
- A valid authenticated session for the Urja Meter Ops portal

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
```

### 2. Navigate to the project directory

```bash
cd flock-energy-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the environment variable

Create a `.env` file in the project root, alongside `app.js` and `server.js`.

Add the following environment variable:

```env
URJA_SESSION_COOKIE=__Secure-better-auth.session_token=your_actual_cookie_value
```

Replace `your_portal_session_cookie` with the value of your authenticated portal session cookie.

The cookie is used by the Axios client to authenticate requests to the Urja Meter Ops portal.

**Important:**

- Keep the `.env` file local.
- Do not commit the `.env` file.
- Do not share your session cookie publicly.
- The session cookie must be valid for portal requests to succeed.

### 5. Start the server

```bash
node server.js
```

The server runs at:

```text
http://localhost:3000
```

## API Endpoints

Base URL:

```text
http://localhost:3000/api/v1
```

### Health Check

Check whether the API server is running.

**Endpoint**

```http
GET /health
```

**Example**

```http
GET http://localhost:3000/health
```

**Response**

```json
{
  "status": "success",
  "message": "Flock Energy API is running"
}
```

### 1. Search Meters

Search for meters using a meter ID or serial number.

**Endpoint**

```http
GET /api/v1/meters
```

**Query Parameters**

| Parameter | Description  |
| --------- | ------------ |
| `q`       | Search query |
| `page`    | Page number  |

**Example**

```http
GET http://localhost:3000/api/v1/meters?q=J100000&page=1
```

**Response Structure**

```json
{
  "status": "success",
  "data": {
    "data": [],
    "total": 0,
    "page": 1,
    "pageSize": 20
  }
}
```

The response structure above is illustrative. Actual results depend on the search query.

### 2. Get Meter Details

Retrieve meter details from the portal.

**Endpoint**

```http
GET /api/v1/meters/:meterId
```

**Example**

```http
GET http://localhost:3000/api/v1/meters/J100004
```

The endpoint returns the meter-details response provided by the portal.

The portal uses a SvelteKit page-data response for meter details. The response is forwarded in its original structure without decoding it into a normalized object.

### 3. Get Meter Location

Retrieve geographical coordinates for a meter.

**Endpoint**

```http
GET /api/v1/meters/:meterId/geo
```

**Example**

```http
GET http://localhost:3000/api/v1/meters/J100000/geo
```

**Example Response**

```json
{
  "status": "success",
  "data": {
    "data": {
      "latitude": "26.938961",
      "longitude": "75.830956"
    }
  }
}
```

The coordinates shown are an example. Actual coordinates depend on the requested meter.

### 4. Get Meter Consumption

Retrieve energy readings for a meter.

**Endpoint**

```http
GET /api/v1/meters/:meterId/consumption
```

**Example**

```http
GET http://localhost:3000/api/v1/meters/J100004/consumption
```

The response contains energy readings provided by the portal.

Available fields include:

- `timestamp`
- `kwh`
- `kvah`
- `voltR`

The response is forwarded in the portal's original data structure.

## Authentication and Session Configuration

The Urja Meter Ops portal requires an authenticated session.

This project uses the `URJA_SESSION_COOKIE` environment variable to configure the session cookie.

The Axios client includes the configured cookie in requests to the portal.

### Session Expiry

During development, the portal session cookie was observed to expire approximately **1 hour after login**.

For example:

- Approximate login time: 4:00 PM IST
- Observed expiry time: 4:59:43 PM IST
- Approximate session duration: 59 minutes and 43 seconds

This is an observed session duration, not a guaranteed fixed expiry time. Actual expiry may vary depending on the portal session.

When the session expires, configure a valid session cookie again before making further portal requests.

## Assumptions

- The user has access to the Urja Meter Ops portal.
- The user provides a valid authenticated session cookie through the environment variable.
- The portal's existing endpoints are used as the source of meter information.
- Portal responses are returned in their existing structure.

## Limitations

- The API depends on the availability of the Urja Meter Ops portal.
- Meter details are returned in the portal's SvelteKit page-data response format.
- The API does not currently decode the meter-details response into a normalized object.
- A valid portal session cookie is required for authenticated requests.

## Future Improvements

- Add input validation for meter IDs and query parameters.
- Add automated tests.
- Centralized error-handling middleware

## Additional Documentation

- `PROTOCOL.md` — Portal communication, authentication, response formats, and observed behavior.
- `openapi.json` — OpenAPI specification for the API.

## License

This project was created as part of a technical assignment.
