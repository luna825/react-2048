import rotateLeft from './utils/rotateLeft.js'

const Tile = function (value, row, column){
  this.value = value || 0;
  this.row = row || -1;
  this.column = column || -1;
  this.oldRow = -1;
  this.oldColumn = -1;
  this.markForDeletion = false;
  this.mergedInto = null;
  this.id = Tile.id++;
}

Tile.id = 0

Tile.prototype.moveTo = function(row, column) {
  this.oldRow = this.row;
  this.oldColumn = this.column;
  this.row = row;
  this.column = column;
};

Tile.prototype.isNew = function() {
  return this.oldRow === -1 && !this.mergedInto ;
};

Tile.prototype.fromRow = function () {
  return this.mergedInto ? this.row : this.oldRow;
};

Tile.prototype.fromColumn = function () {
  return this.mergedInto ? this.column : this.oldColumn;
};

Tile.prototype.toRow = function () {
  return this.mergedInto ? this.mergedInto.row : this.row;
};

Tile.prototype.toColumn = function () {
  return this.mergedInto ? this.mergedInto.column : this.column;
};

Tile.prototype.hasMoved = function () {
  return (this.fromRow() != -1 && (this.fromRow() != this.toRow() || this.fromColumn() != this.toColumn())) ||
    this.mergedInto;
};

const Board = function(){
  this.tiles = [];
  this.cells = [];
  for (let i = 0; i < Board.size; i++){
    this.cells[i] = [this.addTile(),this.addTile(),this.addTile(),this.addTile()]
  }
  this.addRandomTile()
  this.setPositions()
  this.won = false

}
Board.size = 4

Board.prototype.addTile = function() {
  let res = new Tile;
  Tile.apply(res, arguments);
  this.tiles.push(res);
  return res;
};

Board.prototype.addRandomTile = function() {
  let emptyCells = []
  for(let r = 0; r < Board.size; r++){
    for(let c = 0; c < Board.size; c++){
      if(this.cells[r][c].value === 0){
        emptyCells.push({r:r, c:c})
      }
    }
  }
  let index = ~~(Math.random() * emptyCells.length);
  let cell = emptyCells[index];
  let newValue = Math.random < 0.1 ? 4: 2;
  this.cells[cell.r][cell.c] = this.addTile(newValue);
};

Board.prototype.setPositions = function() {
  this.cells.forEach((row, rowIndex)=>{
    row.forEach((tile, columnIndex)=>{
      tile.oldRow = tile.row;
      tile.oldColumn = tile.column;
      tile.row = rowIndex;
      tile.column = columnIndex;
      tile.markForDeletion = false;
    })
  })
};


Board.prototype.moveLeft = function() {
  let hasChanged = false;
  for(let row = 0; row < Board.size; row ++){
    let currentRow = this.cells[row].filter(tile => tile.value !== 0)
    let resultRow = []
    for (let target = 0; target < Board.size; target ++ ){
      let targetTile = currentRow.length ? currentRow.shift() : this.addTile();
      if( currentRow.length && targetTile.value === currentRow[0].value){
        let tile1 = targetTile ;
        targetTile = this.addTile(tile1.value)
        tile1.mergedInto = targetTile;
        let tile2 = currentRow.shift();
        tile2.mergedInto = targetTile ;
        targetTile.value += tile2.value
      }
      resultRow[target] = targetTile;
      this.won |= (targetTile.value === 2048)
      hasChanged |= (targetTile.value !== this.cells[row][target].value)
    }
    this.cells[row] = resultRow;
  }
  return hasChanged;
};

Board.prototype.clearOldTile = function() {
  this.tiles = this.tiles.filter( tile => tile.markForDeletion === false );
  this.tiles.forEach(tile => tile.markForDeletion = true )
};

Board.prototype.move = function(direction) {
  // 0 ->left, 1->up, 2->right, 3->down

  this.clearOldTile();
  for(let i = 0; i < direction; i ++){
    this.cells = rotateLeft(this.cells)
  }
  const hasChanged = this.moveLeft()
  for (let i = direction; i < 4; i ++){
    this.cells = rotateLeft(this.cells)
  }
  if (hasChanged) {
    this.addRandomTile()
  }
  this.setPositions();
  return this
};

Board.prototype.hasWon = function() {
  return this.won;
};

Board.deltaX = [ -1, 0, 0, 1]
Board.deltaY = [ 0, -1, 1, 0]

Board.prototype.hasLost = function() {
  let canMove = false;
  for(let row = 0; row < Board.size; row ++){
    for(let column = 0; column < Board.size; column ++){
      canMove = canMove || (this.cells[row][column].value === 0);
      for(let dir = 0 ; dir < 4 ; dir ++){
        let newRow = row + Board.deltaX[dir];
        let newColumn = column + Board.deltaY[dir]
        if ( newRow < 0 || newRow >= Board.size || newColumn < 0 || newColumn >= Board.size){
          continue;
        }
        canMove = canMove || (this.cells[row][column].value === this.cells[newRow][newColumn].value) 
      }
    }
  }
  return !canMove
};

export default Board