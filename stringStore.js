const crypto = require('crypto')

class StringStore {
  constructor() {
    this.stringStore = new Map()
  }

  computeProperties(str) {
    const length = str.length;
    const lowerStr = str.toLowerCase();
    const is_palindrome = lowerStr === lowerStr.split('').reverse().join('');
    const unique_characters = new Set(str).size;
    const words = str.trim().split(/\s+/);
    const word_count = words.length > 0 && str.trim() !== '' ? words.length : 0;
    const sha256_hash = crypto.createHash('sha256').update(str).digest('hex');

    const character_frequency_map = {};
    for (let char of str) {
      character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
    }
    
    return {
      length,
      is_palindrome,
      unique_characters,
      word_count,
      sha256_hash,
      character_frequency_map
    };
  }

  containsString(str) {
    const str_hash = crypto.createHash('sha256').update(str).digest('hex');
    return this.stringStore.has(str_hash)
  }

  addToStore(str) {
    const properties = this.computeProperties(str);
    const created_at = new Date().toISOString();
    const entry = {
      id: properties.sha256_hash,
      value: str,
      properties,
      created_at
    };
    this.stringStore.set(properties.sha256_hash, entry);
    return this.stringStore.get(properties.sha256_hash)
  }

  getFromStore(str) {
    const str_hash = crypto.createHash('sha256').update(str).digest('hex');
    return this.stringStore.get(str_hash)
  }

  handleFilters({ is_palindrome, min_length, max_length, word_count, contains_character }) {
    let filters = {};
    
    if (is_palindrome !== undefined) {
      if (is_palindrome.toLowerCase() !== 'true' && is_palindrome.toLowerCase() !== 'false') {
        throw new Error('Invalid is_palindrome value');
      }
      filters.is_palindrome = is_palindrome.toLowerCase() === 'true';
    }
    if (min_length !== undefined) {
      filters.min_length = parseInt(min_length, 10);
      if (isNaN(filters.min_length)) throw new Error('Invalid min_length value');
    }
    if (max_length !== undefined) {
      filters.max_length = parseInt(max_length, 10);
      if (isNaN(filters.max_length)) throw new Error('Invalid max_length value');
    }
    if (word_count !== undefined) {
      filters.word_count = parseInt(word_count, 10);
      if (isNaN(filters.word_count)) throw new Error('Invalid word_count value');
    }
    if (contains_character !== undefined) {
      if (typeof contains_character !== 'string' || contains_character.length !== 1) {
        throw new Error('Invalid contains_character value');
      }
      filters.contains_character = contains_character;
    }

    const results = Array.from(this.stringStore.values()).filter((entry) => {
      const p = entry.properties;
      if (filters.is_palindrome !== undefined && p.is_palindrome !== filters.is_palindrome) return false;
      if (filters.min_length !== undefined && p.length < filters.min_length) return false;
      if (filters.max_length !== undefined && p.length > filters.max_length) return false;
      if (filters.word_count !== undefined && p.word_count !== filters.word_count) return false;
      if (filters.contains_character !== undefined && !entry.value.includes(filters.contains_character)) return false;
      return true;
    });

    return ({
      data: results,
      count: results.length,
      filters_applied: filters
    })
  }

  removeFromStore(str) {
    console.log(str);
    
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    this.stringStore.delete(hash)
  }
}

module.exports = StringStore