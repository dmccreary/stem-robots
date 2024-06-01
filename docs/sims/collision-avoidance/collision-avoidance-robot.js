// Collision avoidance Robot
let canvasWidth = 400;
let canvasHeight = 450;
let controlHeight = 50;
let robot = {
  x: 200,
  y: 200,
  width: 40,
  height: 40,
  angle: 0,
  mode: 'stopped',
  speed: 2
};

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  angleMode(DEGREES);
  rectMode(CENTER);
  drawButtons();
}

function draw() {
  fill('aliceblue');
  stroke(0);
  strokeWeight(1);
  // rectmode CENTER means 2x
  rect(0, 0, canvasWidth*2, (canvasHeight-controlHeight)*2);
  strokeWeight(1);
  drawCirclePath();
  displayRobot();
  updateRobot();
}

function drawCirclePath() {
  fill('white');
  stroke(0);
  circle(200, 200, 400);
}

function displayRobot() {
  push();
  translate(robot.x, robot.y);
  rotate(robot.angle);
  fill('blue');
  rect(0, 0, robot.width, robot.height);
  stroke('red');
  line(0, 0, 50, 0); // Front direction line
  pop();
}

function updateRobot() {
  if (robot.mode === 'forward') {
    robot.x += robot.speed * cos(robot.angle);
    robot.y += robot.speed * sin(robot.angle);
    checkBoundary();
  } else if (robot.mode === 'backing') {
    robot.x -= robot.speed * cos(robot.angle);
    robot.y -= robot.speed * sin(robot.angle);
    robot.mode = 'turning';
  } else if (robot.mode === 'turning') {
    robot.angle += random([-120, 120]);
    robot.mode = 'forward';
  }
}

function checkBoundary() {
  let d = dist(robot.x, robot.y, 200, 200);
  if (d > 160) {
    robot.mode = 'backing';
  }
}

function drawButtons() {
  let btnStart = createButton('Start');
  btnStart.position(10, 410);
  btnStart.mousePressed(() => robot.mode = 'forward');
  
  let btnStop = createButton('Stop');
  btnStop.position(70, 410);
  btnStop.mousePressed(() => robot.mode = 'stopped');
  
  let btnReset = createButton('Reset');
  btnReset.position(130, 410);
  btnReset.mousePressed(() => {
    robot.x = 200;
    robot.y = 200;
    robot.angle = 0;
    robot.mode = 'stopped';
  });
}