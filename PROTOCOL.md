# Urja Meter Ops Portal Protocol

## 1. Overview

This document describes how the Flock Energy API communicates with the Urja Meter Ops portal.

The application uses Axios to send HTTP requests to the portal and retrieve meter information.

The portal acts as the source of meter data. The local Express API provides endpoints that forward requests to the portal and return the received data.

## 2. Portal Base URL

```text
https://urja-ops.flockenergy.tech
```

The application communicates with the following portal endpoints:

| Purpose               | Portal Endpoint                   |
| --------------------- | --------------------------------- |
| Search meters         | `/portal/meters/search`           |
| Meter details         | `/meters/{meterId}/__data.json`   |
| Meter location        | `/portal/meters/{meterId}/geo`    |
| Meter energy readings | `/portal/meters/{meterId}/energy` |

## 3. Authentication

### Session Cookie

The Urja Meter Ops portal requires an authenticated session.

The application uses a session cookie configured through the environment variable:

```env
URJA_SESSION_COOKIE=__Secure-better-auth.session_token=your_session_cookie_value
```

The environment variable contains both the cookie name and its value.

The cookie is configured in the Axios client and sent with requests to the portal using the HTTP `Cookie` header.

### Authentication Flow

1. The user authenticates through the Urja Meter Ops portal.
2. The portal provides an authenticated session cookie.
3. The session cookie is configured locally through the `.env` file.
4. The Axios client includes the configured cookie in portal requests.
5. The portal processes the request using the authenticated session.

The application does not currently implement a separate login endpoint.

### Session Expiry

During development, the session cookie was observed to expire approximately one hour after login.

Observed example:

| Detail                       | Value                     |
| ---------------------------- | ------------------------- |
| Approximate login time       | 4:00 PM IST               |
| Observed expiry time         | 4:59:43 PM IST            |
| Approximate session duration | 59 minutes and 43 seconds |

This duration is based on an observed session and is not a guaranteed fixed expiry time.

When the session expires, a valid session cookie must be configured again.

The session cookie must remain private and must not be included in source code, public documentation, or GitHub commits.

## 4. Meter Search

### Portal Endpoint

```http
GET /portal/meters/search
```

### Query Parameters

| Parameter | Description  |
| --------- | ------------ |
| `q`       | Search query |
| `page`    | Page number  |

### Example Request

```http
GET /portal/meters/search?q=J100000&page=1
```

### Observed Response Structure

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "pageSize": 20
}
```

The response structure above is illustrative.

The actual response contains meter records matching the search query.

### Observed Behavior

- The portal supports searching by meter ID and serial number.
- Search results are paginated.
- The observed total number of meter records was 403.
- The observed page size was 20 records.

The meter search response includes fields such as:

- `meterId`
- `serialNo`
- `make`
- `phaseType`
- `installStatus`
- `dtCode`

The actual returned records depend on the search query.

## 5. Meter Details

### Portal Endpoint

```http
GET /meters/{meterId}/__data.json
```

### Example Request

```http
GET /meters/J100004/__data.json?x-sveltekit-invalidated=001
```

The request includes the query parameter:

```text
x-sveltekit-invalidated=001
```

### Observed Behavior

The portal meter-details endpoint returns SvelteKit page-data rather than a conventional JSON object.

During development, different meter records were observed to use different serialized response structures.

Some responses contain parameter-based data references, while others contain class-data structures.

The response may include:

- Meter ID
- Serial number
- Meter make
- Phase type
- Installation status
- Installation type
- Zone
- Circle
- Division
- Subdivision
- Substation
- Feeder
- Distribution transformer

The exact fields depend on the requested meter and the portal response.

### Response Handling

The application currently forwards the portal's meter-details response without decoding its internal SvelteKit serialized structure.

The response is not converted into a normalized meter-details object.

## 6. Meter Location

### Portal Endpoint

```http
GET /portal/meters/{meterId}/geo
```

### Example Request

```http
GET /portal/meters/J100000/geo
```

### Observed Response

```json
{
  "data": {
    "latitude": "26.938961",
    "longitude": "75.830956"
  }
}
```

The coordinates shown are an observed example.

Actual coordinates depend on the requested meter.

### Response Fields

| Field       | Description     |
| ----------- | --------------- |
| `latitude`  | Meter latitude  |
| `longitude` | Meter longitude |

The portal returns geographical coordinates as strings.

## 7. Meter Energy Readings

### Portal Endpoint

```http
GET /portal/meters/{meterId}/energy
```

### Example Request

```http
GET /portal/meters/J100000/energy
```

### Observed Response Structure

```json
{
  "data": [
    {
      "timestamp": "23/06/2026 23:30",
      "kwh": "48438.74",
      "kvah": "52313.84",
      "voltR": "226"
    }
  ]
}
```

The response above is an illustrative example of an observed energy reading.

### Response Fields

| Field       | Description                |
| ----------- | -------------------------- |
| `timestamp` | Energy reading timestamp   |
| `kwh`       | Energy consumption in kWh  |
| `kvah`      | Energy consumption in kVAh |
| `voltR`     | R-phase voltage reading    |

The observed readings were available at approximately 30-minute intervals.

The portal returns the energy readings in its existing data structure.

The application currently forwards this response without transforming the readings.

## 8. Local API Mapping

The following table maps the local Express API endpoints to the corresponding portal endpoints.

| Local API Endpoint                        | Portal Endpoint                  |
| ----------------------------------------- | -------------------------------- |
| `GET /api/v1/meters`                      | `/portal/meters/search`          |
| `GET /api/v1/meters/:meterId`             | `/meters/:meterId/__data.json`   |
| `GET /api/v1/meters/:meterId/geo`         | `/portal/meters/:meterId/geo`    |
| `GET /api/v1/meters/:meterId/consumption` | `/portal/meters/:meterId/energy` |

The local API uses the `/api/v1` prefix for versioning.

The meter consumption endpoint uses the local path `/consumption`, while the portal endpoint uses `/energy`.

## 9. Observed Portal Behavior

The following behavior was observed during development:

- Portal requests require an authenticated session.
- Search results are paginated.
- Search supports meter ID and serial number.
- Meter details are returned through SvelteKit page-data responses.
- Meter-details responses may use different serialized structures.
- Location responses contain latitude and longitude.
- Energy readings contain timestamps and energy-related values.
- Energy readings were observed at approximately 30-minute intervals.
- Session cookies were observed to expire approximately one hour after login.

These observations describe the behavior encountered during development and may change if the portal changes.

## 10. Assumptions

- The Urja Meter Ops portal remains the source of meter information.
- The application uses an authenticated session cookie for portal requests.
- The portal endpoints observed during development remain available.
- The portal's response structures may vary between meter records.

## 11. Limitations

- The application does not currently implement a separate portal login endpoint.
- Meter details are not decoded into a normalized structure.
- The application depends on the portal's existing endpoints and response formats.
- Session expiry may require a new authenticated cookie.
- The portal may change its endpoint behavior or response structures.
