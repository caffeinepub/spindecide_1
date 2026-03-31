// Funny response pools for quick decision buttons

export const YES_NO_RESPONSES = [
  "YES! Absolutely 🎉",
  "No way, don't do it 😤",
  "Bro obviously YES 💯",
  "Hard no. Trust me 😂",
  "Signs point to YES ✨",
  "Nope, the universe said no 🌌",
  "100% YES, go for it 🚀",
  "Nah fam, skip it 🚫",
];

export const FOOD_RESPONSES = [
  "Pizza again? No shame 😎🍕",
  "Ramen. Your soul needs it 🍜",
  "Just cook something bro 👨‍🍳",
  "Tacos. Always tacos 🌮",
  "Cereal at 2am hits different 🥣",
  "Sushi if you're feeling fancy 🍣",
  "Burger time 🍔 no debates",
  "Salad... just kidding. Fries 🍟",
];

export const WATCH_RESPONSES = [
  "Rewatch The Office again 📺",
  "A 3h documentary you'll never finish 😅",
  "Something on Netflix you've had saved for 2 years 📋",
  "Horror movie at midnight 👻 brave move",
  "That anime everyone keeps recommending 🗡️",
  "YouTube rabbit hole, no movie needed 🕳️",
  "Reality TV, zero shame 💅",
  "Rewatch your comfort movie 🎬",
];

export const STUDY_CHILL_RESPONSES = [
  "Bro just study 💀",
  "Chill for 5 min... ok maybe 3 hours 😴",
  "STUDY. Your future self will thank you 📚",
  "Chill. You deserve it honestly 🛋️",
  "Study but with snacks 🍿📖",
  "Flip a coin... wait you already are 🪙",
  "10 min study, 50 min chill deal? 😂",
  "Your deadlines disagree but chill anyway 🤷",
];

// Default wheel options
export const DEFAULT_WHEEL_OPTIONS = [
  "Option A",
  "Option B",
  "Option C",
  "Option D",
  "Option E",
  "Option F",
];

/** Pick a random item from an array */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
