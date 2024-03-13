// Get the car canvas element and set its width to 200
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

// Get the network canvas element and set its width to 300
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

// Get the 2D rendering context for the car canvas
const carCtx = carCanvas.getContext("2d");

// Get the 2D rendering context for the network canvas
const networkCtx = networkCanvas.getContext("2d");

// Create a new road object with the center position based on the car canvas width
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// Define the number of cars
const N = 500;

// Generate an array of cars
const cars = generateCars(N);

// Set the best car to the first car in the array
let bestCar = cars[0];

// Check if there is a "bestBrain" value stored in the local storage
if (localStorage.getItem("bestBrain")) {
  // Iterate through all the cars
  for (let i = 0; i < cars.length; i++) {
    // Parse the "bestBrain" value and assign it to the car's brain
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    // Mutate the brain of all cars except the first one
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

// Create an array of dummy cars for traffic
const traffic = [
  new Car(road.getLaneCenter(0), 100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -820, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2, getRandomColor()),
];

// Call the animate function to start the animation loop
animate();

// Function to save the best car's brain to the local storage
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// Function to discard the "bestBrain" value from the local storage
function discard() {
  localStorage.removeItem("bestBrain");
}

// Function to generate an array of cars
function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    const lane = i % road.laneCount;
    cars.push(new Car(road.getLaneCenter(1), 100 + i * 40, 30, 50, "AI"));
  }
  return cars;
}

var Outputter = 0;
console.log(carCanvas.height);
// Animation loop function
function animate(time) {
    
    
  // Update the positions of the traffic cars
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  
    // If the car has gone off the bottom of the screen, reset it to the top
    if (traffic[i].y > bestCar.y + Math.floor(Math.random() * (700 - 300 + 1)) + 300) {
      let randomLane = Math.floor(Math.random() * road.laneCount);
      
      // Update the car's x position to match the center of the new lane
      traffic[i].x = road.getLaneCenter(randomLane);
      
      // Reset the car's y position to the top of the screen
      traffic[i].y = bestCar.y-800 - Math.random() * 200;
    }
  }
  if (Outputter<1000){
    Outputter+=5;
  }else{
    console.log("Car number 3:",traffic[3].y);
    console.log("player:", bestCar.y);
    Outputter = 0;
  }
  
  // Update the positions of the AI-controlled cars
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // Find the car with the minimum y position (the best car)
  bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));

  // Set the height of the car and network canvases to match the window height
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  // Translate the car canvas to focus on the best car
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  // Draw the road on the car canvas
  road.draw(carCtx);

  // Draw the traffic cars on the car canvas
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }

  // Set global alpha to 0.2 and draw the AI-controlled cars on the car canvas
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }

  // Reset global alpha to 1 and draw the best car on the car canvas
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  // Restore the car canvas to its original state
  carCtx.restore();

  // Set the line dash offset for the network canvas based on time
  networkCtx.lineDashOffset = -time / 50;

  // Draw the network visualization on the network canvas using the best car's brain
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  // Request the next animation frame to continue the loop
  requestAnimationFrame(animate);
}
