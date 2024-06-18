let x, y;
let grid;
let moves = 0;
let moveCard = document.getElementById("moves");
let addBlockCard = document.getElementById("addblockcard")
window.level = 30;
let scl, cols, rows;
let dict = { "10": 3, "20": 5, "40": 10 }

// A function to make a 2D Array
function make2dArray(cols, rows) {
    var arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function setup() {
    // Setting up the canvas
    var canvas = createCanvas(500, 500);
    canvas.style.border = "2px solid black";
    canvas.parent("canvas");

    let savedLevel = localStorage.getItem('level');
    if (savedLevel) {
        window.level = parseInt(savedLevel);
        window.addBlock = dict[savedLevel]
    }
    addBlockCard.innerHTML = "Blocks to add Left: " + window.addBlock
    // adding Block Count 

    console.log(window.level)
    grid = make2dArray(window.level, window.level);
    scl = 500 / window.level;

    rows = width / scl;
    cols = height / scl;

    // setting the grid by filling it with 1s and 0s randomly
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = floor(random(2));
        }
    }
    console.log(grid);
}

function draw() {

    background(0);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * scl;
            let y = j * scl;

            if (grid[i][j] == 1) {
                fill(0);
            } else {
                fill(255);
            }
            stroke(255);
            rect(x, y, scl, scl);
        }
    }
    // for future use
    if (mouseIsPressed) {

    }

}
function checkIfWon() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] == 1) {
                return false
            }
        }
    }
    return true
}

// Basic Flood Fill algorithm (for deleting blocks)
function floodFill(x, y, newColor) {
    if (grid[x][y] != newColor) {
        grid[x][y] = newColor;
        if (x > 0) {
            floodFill(x - 1, y, newColor);
        }
        if (x < cols - 1) {
            floodFill(x + 1, y, newColor);
        }
        if (y > 0) {
            floodFill(x, y - 1, newColor);
        }
        if (y < rows - 1) {
            floodFill(x, y + 1, newColor);
        }
    }
}

function mouseClicked() {
    x = floor(mouseX / scl);
    y = floor(mouseY / scl);
    // adding the block
    if (!checkIfWon()) {
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && grid[x][y] == 0) {

            if (window.addBlock > 0) {
                grid[x][y] = 1
                window.addBlock -= 1
                addBlockCard.innerHTML = "Blocks to add Left: " + window.addBlock
            }
            else {
                alert("No more adding blocks")
            }

        }
           // deleting the block
        else if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {

            floodFill(x, y, 0);
            moves++;
            moveCard.innerHTML = "MOVES: " + moves;
    
        }
    }
    else
    {
        alert("You Had Minimum Moves of: "+moves)
    }
}
function setLevel(value) {
    localStorage.setItem('level', value);
    window.level = parseInt(localStorage.getItem('level'));
    console.log(window.level);
    setup();
}
