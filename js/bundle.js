(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function Cell(id, state) {
    this.id = id;
    this.state = state;
    this.nextState = false;
}

Cell.prototype.toggleState = function() {
    this.state == 'live' ? this.changeState('dead') : this.changeState('live');
}

Cell.prototype.changeState = function(state) {
    this.state = state;
    currentCell = document.getElementById(this.id);
    currentCell.className = state;
}

module.exports = Cell;

},{}],2:[function(require,module,exports){
const Cell = require('./cell');

function Grid(width, height) {
    this.simulating = false;
    this.width = width;
    this.height = height;
    this.cells = [];
    this.nextCells = [];

    this.mouseDown = false;
    this.timer = null;
}

Grid.prototype.initialize = function() {
    this.createGrid();
    this.addEventListeners();
}

Grid.prototype.createGrid = function() {
    let gridRowsHtml = '';

    for (let i = 0; i < this.height; i++) {
        this.cells[i] = [];

        gridRowsHtml += `<tr id="row-${i}" class="grid-row">`;

        for (let j = 0; j < this.width; j++) {
            newCell = new Cell(`${i}-${j}`, 'dead');
            this.cells[i][j] = newCell;

            gridRowsHtml += `<td id="${newCell.id}" class="${newCell.state}"></td>`;
        }

        gridRowsHtml += '</tr>';
    }

    let gridEl = document.getElementById('grid');
    gridEl.innerHTML = gridRowsHtml;
    gridEl.className = 'initialized';
}

Grid.prototype.addEventListeners = function() {
    // disable mouse down state (drawing) on mouse up event anywhere
    // on the window
    window.onmouseup = e => {
        this.mouseDown = false;
    };

    for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
            let cellId = `${i}-${j}`;
            let currentCell = document.getElementById(cellId);

            // start changing cell states (drawing) on mouse down
            currentCell.onmousedown = e => {
                e.preventDefault();

                this.mouseDown = true;
                this.cells[i][j].toggleState();
            };

            // change the state when mouse enters while mouse button is pressed
            currentCell.onmouseenter = e => {
                e.preventDefault();

                if (this.mouseDown) {
                    this.cells[i][j].toggleState();
                }
            };
        }
    }
}

Grid.prototype.clearGrid = function() {
    clearInterval(this.timer);
    this.simulating = false;

    for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
            this.cells[i][j].changeState('dead');
        }
    }
}

Grid.prototype.startSimulation = function() {
    if (this.simulating) {
        clearInterval(this.timer);
    }
    
    this.simulating = true;

    this.timer = setInterval(() => {
        for (let i = 0; i < this.height; i++) {
            this.nextCells[i] = [];
            for (let j = 0; j < this.width; j++) {
                let neighborCount = this.countCellNeighbors(i, j);
                let currentCell = this.cells[i][j];

                if (currentCell.state == 'dead' && neighborCount == 3) {
                    this.nextCells[i][j] = new Cell(currentCell.id, 'live');
                    this.nextCells[i][j].state = 'live';
                } else if (currentCell.state == 'live' && (neighborCount < 2 || neighborCount > 3)) {
                    this.nextCells[i][j] = new Cell(currentCell.id, 'dead');
                } else {
                    this.nextCells[i][j] = new Cell(currentCell.id, currentCell.state);
                }
            }
        }

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.cells[i][j].changeState(this.nextCells[i][j].state);
            }
        }
    }, 100);
}

Grid.prototype.pauseSimulation = function () {
    clearInterval(this.timer);
    this.simulating = false;
}

Grid.prototype.countCellNeighbors = function(x, y) {
    let count = 0;

    for(let i = x - 1; i <= x + 1; i++) {
        if (i >= 0 && i < this.height) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (!(i == x && j == y) && j >= 0 && j < this.width) {
                    if (this.cells[i][j].state == 'live') {
                        count++;
                    }
                }
            }
        }
    }

    return count;
}

module.exports = Grid;

},{"./cell":1}],3:[function(require,module,exports){
const Grid = require('./grid');

let headerHeight = document.getElementById('main-header').offsetHeight;
let gridWidth = Math.floor((window.innerWidth - 32) / 25);
let gridHeight = Math.floor((window.innerHeight - 62 - headerHeight) / 25);
let mainGrid = new Grid(gridWidth, gridHeight);
mainGrid.initialize();

// add event listeners for header buttons
let actionButtons = document.getElementsByClassName('action-button');
for (actionButton of actionButtons) {
    actionButton.onmousedown = e => {
        let simButton = document.getElementById('action-button-simulate');
        switch (e.target.dataset.action) {
            case 'clearGrid':
                simButton.dataset.action = 'startSimulation';
                simButton.innerText = 'Simulate';
                mainGrid.clearGrid();
                break;
            case 'startSimulation':
                simButton.dataset.action = 'pauseSimulation';
                simButton.innerText = 'Pause';
                mainGrid.startSimulation();
                break;
            case 'pauseSimulation':
                simButton.dataset.action = 'startSimulation';
                simButton.innerText = 'Simulate';
                mainGrid.pauseSimulation();
                break;
            default:
                break;
        }
    };
}

},{"./grid":2}]},{},[3]);
