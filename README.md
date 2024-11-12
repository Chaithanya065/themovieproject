# The Movie Project

## How to run in local

#### 1. Clone the repo

```
git clone https://github.com/Chaithanya065/themovieproject.git

cd themovieproject
```

#### 2. Install dependencies

```
npm install
```

#### 3. Set environment variables

```
cp .env.example .env
```

#### 4. Populate the .env file with your own configuration

#### 5. Run it locally

```
npm run dev
```

<br>
<br>

## API Documentation

### Endpoint: Fetch Movies by Year

#### URL `/api/movies`

#### Method `GET`

#### Description

Fetches a list of movies released in a specified year, sorted by popularity. Each movie includes information about editors who worked on it.

---

### Query Parameters

- **`year`** _(required, string)_:

  - The year for which movies are to be fetched.
  - Must be a numeric value representing a valid year (e.g., `2020`).
  - If an invalid year is provided, a `400 Bad Request` response is returned.

- **`page`** _(optional, string)_:
  - The page of results to fetch.
  - Defaults to `1` if not specified.

---

### Responses

#### 200 OK

- **Description**: Movies data fetched successfully.
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "page": 1,
    "movies": [
      {
        "title": "Movie Title",
        "vote_average": 8.5,
        "release_date": "January 1, 2020",
        "editors": ["Editor Name 1", "Editor Name 2"]
      }
    ],
    "total_pages": 10,
    "total_results": 100
  }
  ```
- **Fields**:
  - `page` _(integer)_: Current page of results.
  - `movies` _(array of objects)_: List of movies.
    - `title` _(string)_: Title of the movie.
    - `vote_average` _(number)_: Average vote score of the movie.
    - `release_date` _(string)_: Release date in `Month Day, Year` format.
    - `editors` _(array of strings)_: List of editors who worked on the movie.
  - `total_pages` _(integer)_: Total number of pages available.
  - `total_results` _(integer)_: Total number of movies matching the criteria.

#### 400 Bad Request

- **Description**: Returned if an invalid year is provided.
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "error": "Invalid year provided"
  }
  ```

#### 500 Internal Server Error

- **Description**: Returned if there was an error while fetching movie data from the external service.
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "error": "An error occurred while fetching movies"
  }
  ```

---

### Example Request

```http
GET /api/movies?year=2020&page=1
```

### Example Successful Response

```json
{
  "page": 1,
  "movies": [
    {
      "title": "Inception",
      "vote_average": 8.8,
      "release_date": "July 16, 2010",
      "editors": ["Lee Smith"]
    },
    {
      "title": "Interstellar",
      "vote_average": 8.6,
      "release_date": "November 5, 2014",
      "editors": ["Maryann Brandon"]
    }
  ],
  "total_pages": 10,
  "total_results": 200
}
```
