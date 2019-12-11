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
