const adjectives = ["happy", "funny", "clever", "creative", "brave"];
const nouns = ["cat", "dog", "bird", "fish", "unicorn"];

export function generateUniqueUsername() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);

  const username = `${adjective}_${noun}_${randomNumber}`;
  return username;
}
