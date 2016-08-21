export default function(matrix){
  let rows = matrix.length;
  let columns = matrix[0].length;

  let res = []
  for (let row = 0;row < rows; row++){
    res.push([]);
    for (let column = 0; column < columns; column++){
      res[row][column] = matrix[column][columns - row - 1];
    }
  }
  return res
};