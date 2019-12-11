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
