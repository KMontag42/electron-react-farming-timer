// ES6 Component
// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';
import { Text } from 'react-desktop/windows';

// Search component created as a class
class App extends React.Component {
  static defaultProps = {
    theme: 'light'
  };

  constructor(props) {
    super(props);
    this.state = {
      previousTimes: [],
      targetCount: 100,
      currentCount: 0,
      currentTime: 0
    };
    this.timerInterval = null;
  }

  componentDidMount() {
    // start the interval
    // set the new state
    this.timerInterval = setInterval(() => {
      let newState = this.state;
      newState.currentTime += 1;
      this.setState(newState);
    }, 1000);

    document.getElementById('content').addEventListener('nextLap', () => {
      let newState = this.state;
      newState.currentCount += 1;
      newState.previousTimes.push(this.state.currentTime);
      newState.currentTime = 0;
      this.setState(newState);
    });
  }

  // render method is most important
  // render method returns JSX template
  render() {
    let averageTime = '~';
    let toComplete = '~';

    if (this.state.previousTimes.length > 0) {
      averageTime = (this.state.previousTimes.reduce((a,b) => a+b) / this.state.previousTimes.length).toFixed(3);
      toComplete = ((this.state.targetCount - this.state.currentCount) * averageTime).toFixed(3);
    }
    return (
      <div>
        <Text
          theme={this.props.theme}
          width="100%"
          horizontalAlignment="left"
          verticalAlignment="center"
        >
          {this.state.currentTime}
        </Text>
        <Text
          theme={this.props.theme}
          width="100%"
          horizontalAlignment="left"
          verticalAlignment="center"
        >
          {this.state.currentCount}
          &nbsp;/&nbsp;
          {this.state.targetCount}
        </Text>
        <Text
          theme={this.props.theme}
          width="100%"
          horizontalAlignment="left"
          verticalAlignment="center"
        >
          Avg: {averageTime}
        </Text>
        <Text
          theme={this.props.theme}
          width="100%"
          horizontalAlignment="left"
          verticalAlignment="center"
        >
          To Complete: {toComplete}
        </Text>
      </div>
  );
  }
}

// Render to ID content in the DOM
ReactDOM.render( <App/> ,
  document.getElementById('content')
);
