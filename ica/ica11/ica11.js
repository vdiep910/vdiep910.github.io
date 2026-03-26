// Complete variable definitions and random functions

const customName = document.getElementById("custom-name");
const generateBtn = document.querySelector(".generate");
const story = document.querySelector(".story");

function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

// Raw text strings

// Willy the Goblin
// Big Daddy
// Father Christmas

// the soup kitchen
// Disneyland
// the White House

// spontaneously combusted
// melted into a puddle on the sidewalk
// turned into a slug and slithered away
const characters = [
  "a cooked college student",
  "a talking bee",
  "a giant patrick star"
];

const places = [
  "a CU Boulder toilet",
  "McDonalds parking lot",
  "Ohio"
];

const events = [
  "started aggressively breakdancing for no reason",
  "caused emotional damage",
  "crashed out and destroyed everything",
  "started balling after seeing you"
];

// Partial return random string function

function returnRandomStoryString() {
  const randomCharacter = randomValueFromArray(characters);
  const randomPlace = randomValueFromArray(places);
  const randomEvent = randomValueFromArray(events);

  let storyText = `It was 94 Fahrenheit outside, so ${randomCharacter} decided to go outside (bad idea). When they got to ${randomPlace}, they just stood there for a second, processing life... then suddenly they ${randomEvent}. Bob witnessed the entire situation and was lowkey concerned, but also not surprised — ${randomCharacter} weighs 300 pounds, has zero survival instincts, and it was giving chaos.`;

  return storyText;
}

// Event listener and partial generate function definition

generateBtn.addEventListener("click", generateStory);

function generateStory() {
  let newStory = returnRandomStoryString();

  if (customName.value !== "") {
    const name = customName.value;
    newStory = newStory.replace("Bob", name);
  }

  if (document.getElementById("uk").checked) {
    const weight = `${Math.round(300 / 14)} stone`;
    const temperature = `${Math.round((94 - 32) * (5 / 9))} Celsius`;

    newStory = newStory.replace("300 pounds", weight);
    newStory = newStory.replace("94 Fahrenheit", temperature);
  }

  // TODO: replace "" with the correct expression
  story.textContent = newStory;
  story.style.visibility = "visible";
}