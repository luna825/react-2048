## React 2048
这是一个用React来编写的2048游戏，是在学习[2048-react](https://github.com/IvanVergiliev/2048-react)过程中记录下自己的一些想法。
> 游戏逻辑：通过键盘上的“上下左右”来控制整个游戏，每个数字方块在移动过程中可以看作是将整个柜阵**左旋转后向左移动，移动合并完成后再向左旋转到正确的位置**（左：先旋转0次再转4次，上：先转1次再转3次，右：先转2次再转2次，下：先转3次再转1次）

#### borad.js
整个游戏的逻辑在`borad.js`中，矩阵旋转通过`rotateLeft`函数实现，borad.js主要实现了两个类

- Tile: 数字方块，具有*row,oldRow,column,oldColumn,markForDeletion,mergedInto,id*属性，具有*isNew,fromRow,fromColum,toRow,toColumn,hasMoved*方法
- Board: 游戏矩阵。`cells`矩阵方块，`tiles`在数字方块是`cells`的映射集合
	- addTile: 往`cells`中添加方块，同时映射到`tiles`数组中
	- addRandomTile: 添加一个随机的数字方块
	- setPositions: 将cells的Tile进行矩阵定位
	- moveLeft: 对第cells中的row进行左移，tile.value的值相同刚相加，同时对相加后的tile指定mergedInto
	- clearOldTile: 将已合并的tile设置markForDeletion为ture
	- move: 根据指令矩阵进行移动
	- hasWon,hasLost: 判断游戏胜负

### index.js
整个游戏显示的逻辑在index.js中。其中BoardView组件是主组件，通过state管理一个Borad类，所有的事件处理都通过Borad转发，然后将更改传播到其子组件。在组件加载完成后添加`windows`事件的keyDown监听

Cell组件，仅仅是在没有Tile的地方提供一个浅灰色的背景

TileView则提供所有的有趣的视图显示。该组件通过属性(props)接收一个Tile类，并确定他是否是新的(isNew)或是否移动(hasMoved)。如果Tile移动了，通过原位置与目标位置来设置相应的CSS类，触发正确的动画。

### CSS动画
动画通过CSS3实现。在矩阵上的每一个A点到B点动画都是独立的，我们没有直接在CSS中实现，而是用SASS语法来实现的，这样大大的减少了代码量。

通过对游戏的观察我们可以发现数字方块(Tile)每次的移动要么是水平(horizontal)要么是垂直(vertical)。这就意味着horizontal动画(startRow -> endRow)vertical动画(startColumn -> endColumn)只有2*4^2个

## Building and runing
	npm install
	npm run wpServer