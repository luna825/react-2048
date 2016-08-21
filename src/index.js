import React,{PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'

require('./styles/main.scss')
require('./styles/style.scss')


import Borad from './board'

class Cell extends Component{
  shouldComponentUpdate() {
    return false;
  }
  render(){
    return(
      <span className="cell">{''}</span>
    )
  }
}

class TileView extends Component{

  shouldComponentUpdate(nextProps){
    if(this.props.tile != nextProps.tile){
      return true;
    }
    if(!nextProps.tile.hasMoved() && !nextProps.tile.isNew()){
      return false;
    }
    return true;
  }

  render(){
    const {tile} = this.props;
    let classArr = ['tile'];
    classArr.push('tile' + tile.value)
    if(!tile.mergedInto){
      classArr.push('position_' + tile.row + '_' + tile.column)
    }
    if (tile.mergedInto){
      classArr.push('merged')
    }
    if( tile.isNew() ){
      classArr.push('new')
    }
    if (tile.hasMoved()) {
      classArr.push('row_from_' + tile.fromRow() + '_to_' + tile.toRow());
      classArr.push('column_from_' + tile.fromColumn() + '_to_' + tile.toColumn());
      classArr.push('isMoving');
    }
    let classes = classArr.join(' ')
    return(
      <span className={classes}>{tile.value}</span>
    )
  }
}

class BordView extends Component{
  constructor(props){
    super(props);
    this.state = {
      board: new Borad
    }
  }

  restartGame(){
    this.setState({board: new Borad})
  }
  handleKeyDown(event){
    if( this.state.board.hasWon() ){
      return;
    }
    if(event.keyCode >= 37 && event.keyCode <= 40){
      event.preventDefault();
      const direction = event.keyCode - 37;
      this.setState({board: this.state.board.move(direction)})
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  render(){
    let cells = this.state.board.cells.map((row, rowIndex) =>{
      return (
        <div key={rowIndex}>
          {row.map((_,columnIndex) => <Cell key={rowIndex * Borad.size + columnIndex } />)}
        </div>
      )
    })

    let tiles = this.state.board.tiles
                  .filter(tile => tile.value !== 0 )
                  .map(tile => <TileView tile={tile} key={tile.id} />)
    return(
       <div className="board">
        {cells}
        {tiles}
        <GameEndOverlay board={this.state.board} onRestart={this.restartGame.bind(this)} />
      </div>
    )
  }
}

const GameEndOverlay = ({board, onRestart}) =>{
  let contents = '';
  if(board.hasWon()){
    contents = "Good Job"
  }
  if(board.hasLost()){
    contents = 'Game Over'
  }
  if(!contents){
    return null;
  }
  return(
    <div className="overlay">
      <p className="message">{contents}</p>
      <button className="tryAgain" onClick={onRestart}>Try Again</button>
    </div>
  )

}

ReactDOM.render(<BordView />,document.getElementById('app'))