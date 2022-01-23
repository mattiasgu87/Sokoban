//Set important constants and variables
const container = document.getElementById("container");
let rows = document.getElementsByClassName("gridRow");
let cells = document.getElementsByClassName("cell");
var levelComplete = false;
var currentStage = 0;

PlayGame();

function PlayGame() {
    //play level one
    playLevel(tileMap01.mapGrid, tileMap01.height, tileMap01.width);
}

//function for creating a level
function playLevel(mapGrid, height, width) {
    createGridV2(mapGrid, height, width);
    levelComplete = false;
    currentStage++;
}

//function for creating the game grid
function createGridV2(mapGrid, height, width) {
    makeRows(height);
    makeColumnsV2(mapGrid, width)
}

//make rows for the grid
function makeRows(rowNum) {

    //Creates rows
    for (r = 0; r < rowNum; r++) {
        let row = document.createElement("div");
        container.appendChild(row).className = "gridRow";
        console.log("creating gridrow:" + r)
    };
};

//makes columns for the grid
function makeColumnsV2(mapGrid, cellNum) {
    for (i = 0; i < cellNum; i++) {
        for (j = 0; j < rows.length; j++) {
            let newCell = document.createElement("div");

            //set cell id to x & y position on map grid
            newCell.id = "x" + i + "y" + j;
            rows[j].appendChild(newCell).className = "cell";
            console.log("x = " + i + "y= " + j);

            //call function to add the right tiles/entities to cell
            addToElementClassList(newCell, mapGrid[j][i][0], i, j);
        };

    };
};

//eventlistener for arrowkeys
document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
        //prevent scrolling with arrowkeys
        event.preventDefault();

        if (!levelComplete) {
            switch (event.key) {
                case 'ArrowUp':
                    console.log("player wants to move up");
                    movePlayer(0, -1);
                    break;

                case 'ArrowDown':
                    console.log("player wants to move down");
                    movePlayer(0, 1);
                    break;

                case 'ArrowLeft':
                    console.log("player wants to move Left");
                    movePlayer(-1, 0);
                    break;

                case 'ArrowRight':
                    console.log("player wants to move Right");
                    movePlayer(1, 0);
                    break;

                default:
                    //no defaultcase -> empty
                    break;
            }
        }
    }
}, false);

//function for moving the player character
function movePlayer(x, y) {
    //store the destination positions the player wants to move to
    var newY = Player.yPos + y;
    var newX = Player.xPos + x;

    //get grid elements for the player & destination
    var playerElement = document.getElementById("x" + Player.xPos + "y" + Player.yPos)
    var destinationElement = document.getElementById("x" + newX + "y" + newY)

    //check if the destination contains a wall
    if (!wallCheck(newX, newY)) {
        //check if the destination contains a block
        if (!boxCheck(newX, newY)) {

            //no block/wall-> free to move the player to destination element
            updatePlayer(playerElement, destinationElement, newX, newY);
        }
        else {
            //block in new position-> store the new destionation for the block if it can be moved later
            var newBoxY = newY + y;
            var newBoxX = newX + x;

            //check if the block destination contains a wall
            if (!wallCheck(newBoxX, newBoxY)) {
                //check if the destination contains a wall
                if (!boxCheck(newBoxX, newBoxY)) {
                    var boxDestination = document.getElementById("x" + newBoxX + "y" + newBoxY);

                    //add/remove box +check if Entity.BlockDone should be added/removed from classList
                    destinationElement.classList.remove(Entities.Block);
                    goalBlocker(destinationElement);
                    boxDestination.classList.add(Entities.Block);
                    goalBlocker(boxDestination);

                    //move the player to destination element
                    updatePlayer(playerElement, destinationElement, newX, newY);
                }
            }
        }
    }

    //check if the player completed the level after moving
    if (completedLevel()) {
        levelComplete = true;
        alert("Congratulations! You completed the level!");
        resetGame();

        //play next levels/complete game ->room for improvement
        if (currentStage == 1) {
            playLevel(tileMap02.mapGrid, tileMap02.height, tileMap02.width);
        }
        else if (currentStage == 2) {
            playLevel(tileMap03.mapGrid, tileMap03.height, tileMap03.width);
        }
        else {
            alert("Congratulations! You completed the game!");
            winGame();
        }
    }
};

//function for updating the player
function updatePlayer(playerElement, destinationElement, newX, newY) {
    playerElement.classList.remove(Entities.Character);
    destinationElement.classList.add(Entities.Character);

    //change player postition
    Player.xPos = newX;
    Player.yPos = newY;
};

function wallCheck(x, y) {
    var destinationElement = document.getElementById("x" + x + "y" + y)

    if (destinationElement.classList.contains(Tiles.Wall)) {
        console.log("player can't move inside walls!");
        return true;
    }
    else
        return false;
};

function boxCheck(x, y) {
    var destinationElement = document.getElementById("x" + x + "y" + y)
    if (destinationElement.classList.contains(Entities.Block)) {
        console.log("Box is inside new position");
        return true;
    }
    else
        return false;
};

//function for adding/removing the entity BlockDone on a goal
function goalBlocker(blockElement) {
    console.log("block element checking");
    console.log(blockElement.classList);
    if (blockElement.classList.contains(Entities.Block) && blockElement.classList.contains(Tiles.Goal)) {
        if (!blockElement.classList.contains(Entities.BlockDone)) {
            blockElement.classList.add(Entities.BlockDone);
        }
    }
    else if (!blockElement.classList.contains(Entities.Block) && blockElement.classList.contains(Entities.BlockDone)) {
        blockElement.classList.remove(Entities.BlockDone);
    }
};

//function for adding the right tiles/entities to a cellElement
function addToElementClassList(cellElement, tileMapElement, xPos, yPos) {
    switch (tileMapElement) {
        case 'W':
            cellElement.classList.add(Tiles.Wall);
            break;
        case ' ':
            cellElement.classList.add(Tiles.Space);
            break;
        case 'G':
            cellElement.classList.add(Tiles.Goal);
            Goals.push("x" + i + "y" + j);
            console.log("Adding box goal at: " + "x" + xPos + "y" + yPos);
            break;
        case 'P':
            cellElement.classList.add(Entities.Character);
            Player.xPos = xPos;
            Player.yPos = yPos;
            console.log("Adding player at: " + "x" + xPos + "y" + yPos);
            cellElement.classList.add("tile-playerstart")
            break;
        case 'B':
            cellElement.classList.add(Entities.Block);
            cellElement.classList.add(Tiles.Space);
            break;
        default:
            console.log("trying to add unknown tile/entity to classlist: " + tileMapElement);
            break;
    }
};

//function for checking if all goals contains boxes-> completed level
function completedLevel() {
    console.log("Goal length is: " + Goals.length);
    for (i = 0; i < Goals.length; i++) {
        var goalElement = document.getElementById(Goals[i]);
        console.log("Current goal check on: " + goalElement.id);
        if (!goalElement.classList.contains(Entities.Block)) {
            console.log("no box on goal");
            return false;
        }
    }
    return true;
};


function resetGame() {
    //reset html container
    container.innerHTML = "";

    //reset goal array and player position
    Goals = [];
    Player.yPos = 0;
    Player.xPos = 0;
}

function winGame() {
    let winDiv = document.createElement('div');
    winDiv.id = 'content';
    winDiv.innerHTML = '<h1>You won the game! Congratulations!</h1>';
    container.appendChild(winDiv);
}