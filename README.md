# String Analyzer API (HNG STAGE 1)

This is a RESTful API built with Node.js and Express.js that analyzes strings, computes their properties, and stores them in an in-memory data store. The API supports creating, retrieving, filtering, and deleting string entries based on the specified endpoints.

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher recommended)

### 🚀 **Quick Start** *(60 Seconds)*

```bash
# Clone & Setup
git clone https://github.com/AcharaChisomSolomon/string_analyzer
cd string_analyzer
npm install

# Test & Run
npm start   # 🚀 Server on http://localhost:3000
```

### Dependencies
- **express**: Web framework for building the API. Install via `npm install express`.
- **crypto**: Built-in Node.js module for computing SHA-256 hashes (no installation required).

No other external dependencies are needed.

### Environment Variables
No environment variables are required for this application. The port is hardcoded to 3000 but can be modified in the code if needed.

## API Documentation

### 1. Create/Analyze String
- **Method**: POST
- **Endpoint**: `/strings`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "value": "string to analyze"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "sha256_hash_value",
    "value": "string to analyze",
    "properties": {
      "length": 17,
      "is_palindrome": false,
      "unique_characters": 12,
      "word_count": 3,
      "sha256_hash": "abc123...",
      "character_frequency_map": {
        "s": 2,
        "t": 3,
        "r": 2
      }
    },
    "created_at": "2025-08-27T10:00:00Z"
  }
  ```
- **Error Responses**:
  - 409 Conflict: String already exists
  - 400 Bad Request: Invalid or missing "value"
  - 422 Unprocessable Entity: Invalid data type for "value"

### 2. Get Specific String
- **Method**: GET
- **Endpoint**: `/strings/{string_value}`
- **Success Response (200 OK)**: Same structure as create response
- **Error Responses**:
  - 404 Not Found: String does not exist

**Note**: `{string_value}` should be URL-encoded if it contains special characters (e.g., spaces).

### 3. Get All Strings with Filtering
- **Method**: GET
- **Endpoint**: `/strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a`
- **Query Parameters**:
  - `is_palindrome`: boolean (true/false)
  - `min_length`: integer
  - `max_length`: integer
  - `word_count`: integer
  - `contains_character`: single character
- **Success Response (200 OK)**:
  ```json
  {
    "data": [ /* array of string objects */ ],
    "count": 15,
    "filters_applied": { /* applied filters */ }
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Invalid parameters

### 4. Natural Language Filtering
- **Method**: GET
- **Endpoint**: `/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings`
- **Success Response (200 OK)**:
  ```json
  {
    "data": [ /* array of string objects */ ],
    "count": 3,
    "interpreted_query": {
      "original": "all single word palindromic strings",
      "parsed_filters": { /* parsed filters */ }
    }
  }
  ```
- **Supported Queries**:
  - "all single word palindromic strings" → word_count=1, is_palindrome=true
  - "strings longer than 10 characters" → min_length=11
  - "strings shorter than 5 characters" → max_length=4
  - "palindromic strings that contain the first vowel" → is_palindrome=true, contains_character=a
  - "strings containing the letter z" → contains_character=z
  - "all palindromic strings" → is_palindrome=true
  - "strings with exactly 3 words" → word_count=3
  - "strings between 5 and 10 characters" → min_length=5, max_length=10
  - "strings that contain 'e' and are palindromes" → contains_character=e, is_palindrome=true
- **Error Responses**:
  - 400 Bad Request: Unable to parse query
  - 422 Unprocessable Entity: Conflicting filters (e.g., min_length > max_length)

### 5. Delete String
- **Method**: DELETE
- **Endpoint**: `/strings/{string_value}`
- **Success Response (204 No Content)**: Empty body
- **Error Responses**:
  - 404 Not Found: String does not exist

## Tests
No automated tests are included in this implementation. You can test the .rest files in the requests folder.

## Notes
- **Storage**: Data is stored in-memory using a Map. 
- **Hashing**: SHA-256 is used for unique IDs. Collisions are theoretically possible but extremely unlikely.
- **Natural Language Parsing**: Limited to keyword matching for the specified examples. The parsing logic is encapsulated in the `parseNaturalLanguageQuery` function for modularity.
- **Edge Cases**: Handles empty strings (length 0, word_count 0). Palindrome check is case-insensitive.
- **Security**: No authentication implemented.
- **Path Parameters**: For strings with spaces or special chars, URL-encode them (e.g., "hello world" becomes "hello%20world").
