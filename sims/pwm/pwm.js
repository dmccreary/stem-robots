let canvasWidth = 600;
let canvasHeight = 200;
let dutyCycleSlider;
let fillCheckbox; // Checkbox to toggle fill
let dutyCycle = 0.5; // Initialize to 50%
let cycles = 6;
let waveHeight = canvasHeight / 3;
let leftSliderMargin = 155; // at 16 point font

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(16);

  dutyCycleSlider = createSlider(0, 1, 0.5, 0.01); // Range from 0 to 1, default value 0.5, step size 0.01
  dutyCycleSlider.position(leftSliderMargin, canvasHeight - 47); // Position slider
  dutyCycleSlider.size(canvasWidth - leftSliderMargin - 20); // Set width of slider

  // Create and position the "Fill" checkbox
  fill('white');
  fillCheckbox = createCheckbox('', true);
  fillCheckbox.position(23, canvasHeight - 28);
}

function draw() {
  background('black');

  // Update duty cycle
  dutyCycle = dutyCycleSlider.value();

  // Set stroke for waveform
  stroke('limegreen');
  strokeWeight(2); // make the line be double wide

  // Check if the "Fill" checkbox is checked
  if (fillCheckbox.checked()) {
    fill('limegreen'); // Enable fill if checkbox is checked
  } else {
    noFill(); // Disable fill if checkbox is not checked
  }

  // Generate PWM waveform
  beginShape();
  let yOffset = height / 3; // Set the Y-offset for the waveform
  for (let x = 0; x < width; x++) {
    // Map x to time period of waveform
    let t = map(x, 0, width, 0, TWO_PI * cycles);

    // Calculate value of waveform at this point in time
    // Draw high if in duty cycle, low otherwise
    let y = (sin(t) > 2 * dutyCycle - 1) ? (2 * height / 3) : (height / 3);

    // Add vertex to waveform
    vertex(x, y);
  }
  if (fillCheckbox.checked()) {
    vertex(width, yOffset+waveHeight); // Close the shape at the bottom right corner
    vertex(0, yOffset+waveHeight); // Close the shape at the bottom left corner
    endShape(CLOSE);
  } else {
    // just the line
    endShape();
  }
  
  

  // Display duty cycle
  fill('white');
  noStroke();
  // Display duty cycle as percentage
  text("Duty Cycle: " + nf(dutyCycle * 100, 0, 0) + "%", 20, height - 40);
  text("Fill Area Under Signal", 40, height-20)
}
