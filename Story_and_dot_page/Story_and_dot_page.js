// Global variables
let inputBox;              // HTML multiline text input box\ nlet storyBtn, clearBtn;    // "Story" and "Delete" buttons
let fullText = "";         // Full text to be displayed by typing effect
let typedText = "";        // Text already displayed by typing effect
let textIndex = 0;           // Index of the next character to display
let lastTypeTime = 0;        // Timestamp of the last character added
const typeInterval = 70;    // Typing interval in milliseconds

// Array to store all dots; each object has: x, y, createdTime, targetSize
let dots = [];

// Dot animation parameters
const fadeDuration = 5000;   // Time for opacity transition (ms)
const growDuration = 8000;   // Time for size transition (ms)
const initialSize = 5;       // Initial dot diameter (px)
const minTargetSize = 10;    // Minimum target dot diameter (px)
const maxTargetSize = 50;    // Maximum target dot diameter (px)

// Margins for the text drawing area
const marginX = 100;  // Horizontal margin (px)
const marginY = 100;  // Vertical margin (px)

// Layout constants for buttons and input box
const btnMargin = 20;   // Distance from screen edge (px)
const btnHeight = 30;   // Button height (px)
const btnWidth = 80;    // Button width (px)
const inputHeight = 50; // Text area height (px)

// Preset Story text
const presetText = "I’m over seventy now. I used to live out in the countryside with my husband, our daughter, and our two sons. When our daughter entered high school, we moved into town so she could study and commute more easily. To support the children’s schooling, we opened a little wonton shop. My daughter worked very hard and was admitted to a fine school; after graduating, she kept striving to find her path in life. Later, she gave birth to my granddaughter—a shy, bright, and introverted little girl who studies diligently and earns excellent grades. On weekends she would come to my home for meals and delight me with stories of her school day. Because she attended a boarding school for middle school, I could see her only on weekends. Then, in high school, she went abroad to study. I pray she takes good care of herself out there. It’s been so long since I last saw her; I wonder how she is doing.";

function setup() {
  // 1. Load a web font (example using Google Fonts)
  let fontLink = createElement('link');
  fontLink.attribute('rel', 'stylesheet');
  fontLink.attribute('href', 'https://fonts.googleapis.com/css2?family=Roboto&display=swap');
  textFont('Roboto');

  // 2. Create a full-screen canvas
  createCanvas(windowWidth, windowHeight);
  textSize(32);
  textAlign(LEFT, TOP);
  textLeading(40);

  // 3. Create the "Story" button
  storyBtn = createButton('Story');
  storyBtn.size(btnWidth, btnHeight);
  storyBtn.position(
    btnMargin,
    windowHeight - inputHeight - btnMargin - btnHeight
  );
  storyBtn.mousePressed(() => {
    // Clear previous content
    fullText = "";
    typedText = "";
    textIndex = 0;
    // Set preset text in the input box
    inputBox.value(presetText);
    // Prepare the text to type
    fullText = presetText;
    lastTypeTime = millis();
  });

  // 4. Create the "Delete" button
  clearBtn = createButton('Delete');
  clearBtn.size(btnWidth, btnHeight);
  clearBtn.position(
    btnMargin + btnWidth + 10,
    windowHeight - inputHeight - btnMargin - btnHeight
  );
  clearBtn.mousePressed(() => {
    // Clear only the input and displayed text; keep dots
    inputBox.value("");
    fullText = "";
    typedText = "";
    textIndex = 0;
  });

  // 5. Create the bottom textarea for user input
  inputBox = createElement('textarea');
  inputBox.position(btnMargin, windowHeight - inputHeight - btnMargin);
  inputBox.size(windowWidth - 2 * btnMargin, inputHeight);
  inputBox.style('font-size', '18px');
  inputBox.style('padding', '4px');
  inputBox.input(() => {
    // When user types manually, reset typing effect
    fullText = inputBox.value();
    typedText = "";
    textIndex = 0;
    lastTypeTime = millis();
  });

  // Initialize typing timer
  lastTypeTime = millis();
}

function draw() {
  // Clear background to solid blue
  background(0, 0, 255);

  // Typing effect and dot generation
  if (textIndex < fullText.length && millis() - lastTypeTime >= typeInterval) {
    typedText += fullText.charAt(textIndex);
    textIndex++;
    lastTypeTime = millis();
    // Create a random dot
    let x = random(width), y = random(height);
    let targetSize = random(minTargetSize, maxTargetSize);
    dots.push({ x, y, createdTime: millis(), targetSize });
  }

  // Draw the typed text with automatic wrapping and newline support
  fill(0);
  noStroke();
  text(typedText, marginX, marginY, width - 2 * marginX);

  // Draw the dots over the text
  noStroke();
  for (let d of dots) {
    let elapsed = millis() - d.createdTime;
    // Opacity transition from 30% to 100%
    let alpha = map(elapsed, 0, fadeDuration, 0.3 * 255, 255);
    alpha = constrain(alpha, 0.3 * 255, 255);
    fill(255, alpha);
    // Size transition from initialSize to targetSize
    let sz = map(elapsed, 0, growDuration, initialSize, d.targetSize);
    sz = constrain(sz, initialSize, d.targetSize);
    ellipse(d.x, d.y, sz);
  }
}

// Update fullText when window is resized or input changes
function windowResized() {
  // Resize canvas
  resizeCanvas(windowWidth, windowHeight);
  // Reposition buttons and input box
  storyBtn.position(
    btnMargin,
    windowHeight - inputHeight - btnMargin - btnHeight
  );
  clearBtn.position(
    btnMargin + btnWidth + 10,
    windowHeight - inputHeight - btnMargin - btnHeight
  );
  inputBox.position(btnMargin, windowHeight - inputHeight - btnMargin);
  inputBox.size(windowWidth - 2 * btnMargin, inputHeight);
}
