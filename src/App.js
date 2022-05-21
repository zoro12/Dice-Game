import React from 'react';
import Player from './Components/Player/Player';
import GameBoard from './Components/GameBoard/GameBoard';

import './App.css';

class App extends React.Component {
  state = {
    currentPlayer: 'player1',
    scoreGoal: 100,
    newGame: false,
    holdPressed: false,
    currentDiceRoll: [1, 1],
    rolling: false,
    player1: {
      name: 'Samer',
      tempScore: 0,
      globalScore: 0,
      winned: null,
    },
    player2: {
      name: 'Avi',
      tempScore: 0,
      globalScore: 0,
      winned: null,
    },
  };

  updateCurrentPlayer = (currentDiceRoll) => {
    if (!currentDiceRoll)
      this.setState(
        (prevState) => {
          let otherPlayer = this.state.currentPlayer;
          const number = otherPlayer.charAt(otherPlayer.length - 1);
          otherPlayer =
            number === '1'
              ? otherPlayer.replace(/.$/, '2')
              : otherPlayer.replace(/.$/, '1');
          console.log(otherPlayer);
          return {
            rolling: true,
            currentDiceRoll: [6, 6],
            currentPlayer: otherPlayer,
            [this.state.currentPlayer]: {
              ...prevState[this.state.currentPlayer],
              tempScore: 0,
            },
          };
        },
        () => {
          setTimeout(() => {
            this.setState((prevState) => {
              return { rolling: false };
            });
          }, 1500);
        }
      );
    else {
      this.setState(
        (prevState) => {
          return {
            rolling: true,
            currentDiceRoll: currentDiceRoll,
            [this.state.currentPlayer]: {
              ...prevState[this.state.currentPlayer],
              tempScore:
                this.state[this.state.currentPlayer].tempScore +
                currentDiceRoll[0] +
                currentDiceRoll[1],
            },
          };
        },
        () =>
          setTimeout(() => {
            this.setState((prevState) => {
              return { rolling: false };
            });
          }, 1000)
      );
      console.log('imhere');
    }
  };

  holdCurrentPlayer = () => {
    if (this.state.player1.winned || this.state.player2.winned)
      this.resetGame();
    else {
      this.setState(
        (prevState) => {
          const globScore =
            this.state[prevState.currentPlayer].globalScore +
            this.state[prevState.currentPlayer].tempScore;

          let otherPlayer = this.state.currentPlayer;
          const number = otherPlayer.charAt(otherPlayer.length - 1);
          otherPlayer =
            number === '1'
              ? otherPlayer.replace(/.$/, '2')
              : otherPlayer.replace(/.$/, '1');
          console.log(
            'currentPlayer global ',
            this.state[prevState.currentPlayer].globalScore
          );
          return {
            ...prevState,
            currentPlayer: otherPlayer,
            [this.state.currentPlayer]: {
              ...prevState[this.state.currentPlayer],
              tempScore: 0,
              globalScore: globScore,
              winned:
                globScore === this.state.scoreGoal ||
                this.state[otherPlayer].globalScore > 100
                  ? true
                  : false,
            },
            [otherPlayer]: {
              ...prevState[otherPlayer],
              winned:
                this.state[otherPlayer].globalScore === this.state.scoreGoal ||
                globScore > 100
                  ? true
                  : false,
            },
          };
        },
        () => {}
      );
    }
  };

  updateTotalScoreFromCurrent = () => {
    //* this.setState totalScore of the current player += playerTurnCurrentScore
  };

  newGame = () => {
    this.setState((prevState) => !prevState);
  };

  switchUsers = () => {
    this.setState((prevState) => {
      if (this.state.currentPlayer === 'Player1')
        return {
          ...prevState,
          currentPlayer: 'Player2',
          player1: {
            ...prevState.player1,
            tempScore: 0,
          },
        };
      else
        return {
          ...prevState,
          currentPlayer: 'Player1',
          player2: {
            ...prevState.player2,
            tempScore: 0,
          },
        };
    });
  };
  currentPlayerLosed = () => {
    this.setState((prevState) => {
      return { currentPlayerLosed: true };
    });
    this.switchUsers();
  };

  rollIt = () => {
    if (this.state.player1.winned || this.state.player2.winned)
      this.resetGame();
    else {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      console.log('--------------------------------------');
      console.log(dice1, dice2);
      if (dice1 === dice2 && dice1 === 6 && dice2 === 6)
        this.updateCurrentPlayer(null);
      else this.updateCurrentPlayer([dice1, dice2]);
    }
  };

  resetGame = () => {
    this.setState({
      currentPlayer: 'player1',
      scoreGoal: 100,
      newGame: false,
      holdPressed: false,
      currentDiceRoll: [1, 1],
      player1: {
        name: 'Samer',
        tempScore: 0,
        globalScore: 0,
        winned: null,
      },
      player2: {
        name: 'Avi',
        tempScore: 0,
        globalScore: 0,
        winned: null,
      },
    });
  };

  render() {
    //console.log(this.state.currentPlayer);
    return (
      <div className='container'>
        <Player
          currentPlayer={this.state[this.state.currentPlayer].name}
          playerName={this.state.player1.name}
          tempScore={this.state.player1.tempScore}
          holdPressed={this.state.holdPressed}
          scoreGoal={this.state.scoreGoal}
          switchUsers={this.switchUsers}
          winned={this.state.player1.winned}
          globalScore={this.state.player1.globalScore}
        />
        <GameBoard
          currentPlayer={this.state.currentPlayer}
          newGame={this.newGame}
          resetGame={this.resetGame}
          holdCurrentPlayer={this.holdCurrentPlayer}
          currentDiceRoll={this.state.currentDiceRoll}
          rollIt={this.rollIt}
          rolling={this.state.rolling}
        />
        <Player
          currentPlayer={this.state[this.state.currentPlayer].name}
          playerName={this.state.player2.name}
          tempScore={this.state.player2.tempScore}
          holdPressed={this.state.holdPressed}
          scoreGoal={this.state.scoreGoal}
          switchUsers={this.switchUsers}
          winned={this.state.player2.winned}
          globalScore={this.state.player2.globalScore}
        />
      </div>
    );
  }
}

export default App;
