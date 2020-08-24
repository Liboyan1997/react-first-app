import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  const color=props.isRed?{color:'red'}:{}
  // console.log(props)
    return(
        <button className='square' onClick={props.onClick} style={color}>
          {props.value}
          {props.isRed}
        </button>
    )
}

  class Board extends React.Component {
    renderSquare(i) {
      // console.log(i)
      // let a=this.props.list.indexOf(i)
      let isRed=false

      if(this.props.list){
        if(this.props.list.indexOf(i)!=-1){
          isRed=true
          console.log(isRed,i,this.props.list)
        }
      }
      
      return (
        <div>
        <Square key={i}
            value={this.props.squares[i]} 
            onClick={()=>this.props.onClick(i)}
            isRed={isRed}
        />
        </div>
      );
    }
  
    render() {
      // console.log(this.props.list)
      let board_dom=[]
      for(var i=0;i<3;i++){
        let square_dom=[]
        for(var j=0;j<3;j++){
          square_dom.push(
            this.renderSquare(i*3+j)
          )
        }
        // console.log(i)
        board_dom.push( 
        <div key={i} className="board-row">
        {square_dom}
        </div>)
      }
     
      return (
        <div>
          {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
          {board_dom}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
          //点击过的记录
            history:[{
                squares:Array(9).fill(null),
                where:''
            }],
            //第几步下
            stepNumber:0,
            //是否是x下
            xIsNext:true,
            //记录坐标
            coordinate:null,
            //记录order
            isUp:true
        }
    }
    handleClick(i){
      //深拷贝 history
      const history=this.state.history.slice(0,this.state.stepNumber+1);
      //当前记录
      const current=history[history.length-1];
      //获取current中的数据 squares?? 
      const squares=current.squares.slice();
      let currentCoor=null;
      switch (i) {
        case 0:
          currentCoor="1,1"
          break;
        case 1:
          currentCoor="1,2"
        break;
        case 2:
          currentCoor="1,3"
        break;
        case 3:
          currentCoor="2,1"
        break;
        case 4:
          currentCoor="2,2"
        break;
        case 5:
          currentCoor="2,3"
        break;
        case 6:
          currentCoor="3,1"
        break;
        case 7:
          currentCoor="3,2"
        break;
        case 8:
          currentCoor="3,3"
        break;       
        default:
          break;
      }
      if(calculateWinner(squares)||squares[i]){
        return;
      }
      squares[i]=this.state.xIsNext?'X':'O';
      this.setState({
        history:history.concat([{
          squares:squares,
          where:currentCoor
        }]),
        stepNumber: history.length,
        xIsNext:!this.state.xIsNext,
        // coordinate:currentCoor
      })
    }
    //回顾游戏进程
    jumpTo(step){
      this.setState({
        stepNumber:step,
        xIsNext:(step%2)===0,
      })
      console.log(step)
    }
    //游戏步骤 降序还是升序
    order(){
      this.setState({
        isUp:!this.state.isUp
      })
    }
    render() {
        const history=this.state.history;
        const current=history[this.state.stepNumber];
        const winner=calculateWinner(current.squares);
        // console.log(current.squares,this.state.stepNumber)
        if(this.state.stepNumber==8){
          noWinner(current.squares)
        }
        // console.log(typeof(winner))
        // if(typeof(winner)){
        //   const {list}=winner[1].list
        //   console.log(list)
        // }
          const moves=history.map((step,move)=>{
            // console.log(step)
            const desc=move?'Go to move #'+move:'Go to game start';
            let coor=" where:"+step.where
            if(move===0){
              coor=''
            }
            return (
              <li key={move} className={move===this.state.stepNumber?'class1':'class2'}>
                <button 
                  onClick={()=>this.jumpTo(move)}
                >
                   {desc}{coor}
                </button>
              </li>
            );
          });
        
        let status;
        let list
        if(winner){
          if(winner.length==2){
            status='Winer:'+winner[0];
            list=winner[1].list;
          }else{
            status='everyone lose';
          }
            
            // console.log(list)
        }else{
          status='no player win';
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            //props传值
             list={list}
             squares={current.squares}
             onClick={(i)=>{
                 this.handleClick(i)
             }}
            />
          </div>
          <div className="game-info">
          <button onClick={()=>{this.order()}}>{'点击之后为 '+(this.state.isUp?'降序':'升序')}</button>
            <div>{status}</div>
            <ol className={this.state.isUp?'a':'b'}>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
//判断获胜者的函数
  function calculateWinner(squares){
    // 所有获胜的情况
      const lines=[
          [0,1,2],
          [3,4,5],
          [6,7,8],
          [0,3,6],
          [1,4,7],
          [2,5,8],
          [0,4,8],
          [2,4,6]
      ];
      for(let i=0;i<lines.length;i++){
          const [a,b,c]=lines[i];
          if(squares[a]&&squares[a]===squares[b]&&squares[a]===squares[c]){
              // console.log(a,b,c)
              return [squares[a],{list:[a,b,c]}];
          }
      }
      return null;
  }
  //判断是否平局
  function noWinner(list){
    // let a=winner();
    console.log(list,"aaa")
    let index;
    for(var i=0;i<list.length;i++){
      if(list[i]==null){
        index=i
      }
    }
    let arr=list.concat()
    arr.splice(index,1,"X")
    console.log(arr)
    console.log(calculateWinner(arr))
    if(calculateWinner(arr)){
      return ['no one']
    }
  }