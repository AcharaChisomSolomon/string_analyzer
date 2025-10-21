function parseNaturalLanguageQuery(query) {
  if (!query || typeof query !== 'string') {
    throw new Error('Unable to parse natural language query');
  }

  const lowerQuery = query.toLowerCase();
  let parsed_filters = {};

  // Extended keyword-based parsing
  if (lowerQuery.includes('all single word palindromic strings')) {
    parsed_filters.word_count = 1;
    parsed_filters.is_palindrome = true;
  } else if (lowerQuery.includes('strings longer than')) {
    const match = lowerQuery.match(/longer than (\d+)/);
    if (match) {
      parsed_filters.min_length = parseInt(match[1], 10) + 1;
    }
  } else if (lowerQuery.includes('strings shorter than')) {
    const match = lowerQuery.match(/shorter than (\d+)/);
    if (match) {
      parsed_filters.max_length = parseInt(match[1], 10) - 1;
    }
  } else if (lowerQuery.includes('palindromic strings that contain the first vowel')) {
    parsed_filters.is_palindrome = true;
    parsed_filters.contains_character = 'a';
  } else if (lowerQuery.includes('strings containing the letter')) {
    const match = lowerQuery.match(/containing the letter (\w)/);
    if (match) {
      parsed_filters.contains_character = match[1];
    }
  } else if (lowerQuery.includes('all palindromic strings')) {
    parsed_filters.is_palindrome = true;
  } else if (lowerQuery.includes('strings with exactly')) {
    const match = lowerQuery.match(/with exactly (\d+) words?/);
    if (match) {
      parsed_filters.word_count = parseInt(match[1], 10);
    }
  } else if (lowerQuery.includes('strings between') && lowerQuery.includes('and') && lowerQuery.includes('characters')) {
    const match = lowerQuery.match(/between (\d+) and (\d+) characters/);
    if (match) {
      parsed_filters.min_length = parseInt(match[1], 10);
      parsed_filters.max_length = parseInt(match[2], 10);
    }
  } else if (lowerQuery.includes('strings that contain') && lowerQuery.includes('and are palindromes')) {
    const match = lowerQuery.match(/contain ['"]?(\w)['"]? and are palindromes/);
    if (match) {
      parsed_filters.contains_character = match[1];
      parsed_filters.is_palindrome = true;
    }
  }

  if (Object.keys(parsed_filters).length === 0) {
    throw new Error('Unable to parse natural language query');
  }

  // Check for conflicts
  if (parsed_filters.min_length !== undefined && parsed_filters.max_length !== undefined && parsed_filters.min_length > parsed_filters.max_length) {
    throw new Error('Query parsed but resulted in conflicting filters');
  }

  return parsed_filters;
}

module.exports = parseNaturalLanguageQuery