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
