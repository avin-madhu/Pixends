// import "https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.js"
// import "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
// import "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
// import "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

let x, y;
let grid;
let moves = 0;
let moveCard = document.getElementById("moves");
let addBlockCard = document.getElementById("addblockcard")
window.level = 30;
let scl, cols, rows;
let dict = { "10": 3, "20": 5, "40": 10 }
let levelName =  { "10": "Easy", "20": "Medium", "40": "Hard" }

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
    
}




window.scoreSubmitted = false;

// function to check if the user won or not
function checkIfWon() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] == 1) {
                return false;
            }
        }
    }
    // Submit the score to Firestore if the user has won
    onAuthStateChanged(auth, user => {
        if (user && !window.scoreSubmitted) {
            window.scoreSubmitted = true; // Prevent multiple submissions
            addDoc(collection(db, "scores"), {
                uid: user.uid,
                username: window.username, // Ensure username is fetched correctly
                score: moves,
                level: levelName[window.level]
            }).then(docRef => {
                console.log("Document written with ID: ", docRef.id);
            }).catch(error => {
                console.error("Error adding document: ", error);
            });
        }
    });
    return true;
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
                if(!window.modalShown)
                    {
                        alert("No more adding blocks")
                    }
            }

        }
        //    deleting the block
        else if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {

            floodFill(x, y, 0);
            moves++;
            moveCard.innerHTML = "MOVES: " + moves;
    
        }
    }
    else
    {
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && grid[x][y] == 0) {
        alert("You Had Minimum Moves of: "+moves)
        }
    }
}


window.modalShown = false
document.addEventListener('DOMContentLoaded', function () {
    const modals = document.getElementById('signup-modal');
  
    modals.addEventListener('shown.bs.modal', function () {
      window.modalShown = true
    });
  
    modals.addEventListener('hidden.bs.modal', function () {
        window.modalShown = false
    });
  });
  

  document.addEventListener('DOMContentLoaded', function () {
    const modall = document.getElementById('login-modal');
  
    modall.addEventListener('shown.bs.modal', function () {
      window.modalShown = true
    });
  
    modall.addEventListener('hidden.bs.modal', function () {
        window.modalShown = false
    });
  });


function setLevel(value) {
    localStorage.setItem('level', value);
    window.level = parseInt(localStorage.getItem('level'));
    console.log(window.level);
    window.location.reload()
    setup();
}

// export {checkIfWon}