const crypto = require('crypto')

class StringStore {
  constructor() {
    this.stringStore = new Map()
  }

  computeProperties(str) {
    if (typeof str !== 'string') {
      throw new Error('Invalid data type for "value" (must be string)');
    }

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
}

module.exports = StringStore