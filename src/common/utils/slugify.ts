export function slugify(text) {
  const turkishCharacters = {
    'çÇ': 'c',
    'ğĞ': 'g',
    'şŞ': 's',
    'üÜ': 'u',
    'ıİ': 'i',
    'öÖ': 'o'
  };
  Object.keys(turkishCharacters).forEach(key => {
    text = text.replace(new RegExp('[' + key + ']', 'g'), turkishCharacters[key]);
  });
  return text.replace(/[^-a-zA-Z0-9\s]+/ig, '')
    .replace(/\s/gi, '-')
    .replace(/[-]+/gi, '-')
    .toLowerCase();
}
