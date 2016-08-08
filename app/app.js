// ES6 Component
// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';
import { Text, Label, Button } from 'react-desktop/windows';
import _ from 'underscore';
import moment from 'moment';

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
      currentTime: 0,
      currentView: 'home'
    };
    this.timerInterval = null;
    this.onSetupClick = this.onSetupClick.bind(this);
    this.onStartClick = this.onStartClick.bind(this);
    this.onStopClick = this.onStopClick.bind(this);
    this.onPauseClick = this.onPauseClick.bind(this);
    this.onSettingsClick = this.onSettingsClick.bind(this);
    this.setupInterval = this.setupInterval.bind(this);
    this.restartTimer = this.restartTimer.bind(this);
    this.onTotalInputChange = this.onTotalInputChange.bind(this);
  }

  setupInterval() {
    if (this.timerInterval == null) {
      this.timerInterval = setInterval(() => {
        let newState = this.state;
        newState.currentTime += 1;
        this.setState(newState);
      }, 1000);
    }
  }

  restartTimer(alterState = false) {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    if (alterState) {
      this.setState({currentCount: 0, currentTime: 0});
    }
  }

  componentDidMount() {
    let content = document.getElementById('content');

    content.addEventListener('nextLap', () => {
      if (this.state.currentView == 'home') {
        let newState = this.state;
        newState.currentCount += 1;
        newState.previousTimes.push(this.state.currentTime);
        newState.currentTime = 0;
        this.setState(newState);
      }
    });

    content.addEventListener('play', () => {
      if (this.state.currentView == 'home') {
        this.onStartClick();
      }
    });

    content.addEventListener('stop', () => {
      if (this.state.currentView == 'home') {
        this.onStopClick(true);
      }
    });

    content.addEventListener('pause', () => {
      if (this.state.currentView == 'home') {
        this.onPauseClick();
      }
    });
  }

  componentDidUpdate() {
    if (this.state.currentView != 'home') {
      this.restartTimer(true);
    }
  }

  onSetupClick() {
    let newState = this.state;
    newState.currentView = 'setup';
    this.setState(newState);
  }

  onStartClick() {
    this.setupInterval();
  }

  onStopClick() {
    this.restartTimer(true);
  }

  onPauseClick() {
    this.restartTimer();
    this.forceUpdate();
  }

  onSettingsClick() {

  }

  homeView() {
    let averageTime = moment.duration(0);
    let toComplete = moment.duration(0);
    let currentMoment = moment.duration(this.state.currentTime * 1000);

    if (this.state.previousTimes.length > 0) {
      averageTime = moment.duration((this.state.previousTimes.reduce((a,b) => a+b) / this.state.previousTimes.length) * 1000);
      toComplete = moment.duration(((this.state.targetCount - this.state.currentCount) * averageTime) * 1000);
    }

    return (
      <div>
        <Text
          theme={this.props.theme}
          width="90%"
          horizontalAlignment="left"
          verticalAlignment="center"
          className="inline-flex"
        >
          Current: {padNumber(currentMoment.hours())}:{padNumber(currentMoment.minutes())}:{padNumber(currentMoment.seconds())}
        </Text>
        <span className="inline-flex" style={{width: "10%"}}>
          <a href="#" onClick={this.onSetupClick}>
            <i className="fa fa-edit"/>
          </a>
        </span>
        <Text
          theme={this.props.theme}
          width="90%"
          horizontalAlignment="left"
          verticalAlignment="center"
          className="inline-flex"
        >
          Progress: {this.state.currentCount}
          &nbsp;/&nbsp;
          {this.state.targetCount}
        </Text>
        <span className="inline-flex" style={{width: "10%"}}>
          <a href="#" onClick={this.onSettingsClick}>
            <i className="fa fa-gear"/>
          </a>
        </span>
        <Text
          theme={this.props.theme}
          width="90%"
          horizontalAlignment="left"
          verticalAlignment="center"
          className="inline-flex"
        >
          Avg: {padNumber(averageTime.hours())}:{padNumber(averageTime.minutes())}:{padNumber(averageTime.seconds())}
        </Text>
        <span className="inline-flex" style={{width: "10%"}}>
          <a href="#" onClick={this.timerInterval == null ? this.onStartClick : this.onPauseClick}>
            <i className={'fa ' + (this.timerInterval == null ? 'fa-play' : 'fa-pause')}/>
          </a>
        </span>
        <Text
          theme={this.props.theme}
          width="90%"
          horizontalAlignment="left"
          verticalAlignment="center"
          className="inline-flex"
        >
          To Complete: {padNumber(toComplete.hours())}:{padNumber(toComplete.minutes())}:{padNumber(toComplete.seconds())}
        </Text>
        <span className="inline-flex" style={{width: "10%"}}>
          <a href="#" onClick={this.onStopClick}>
            <i className="fa fa-stop"/>
          </a>
        </span>
      </div>
    );
  }

  setupView() {
    return (
      <div>
        <form onSubmit={this.onTotalInputChange}>
          <Label>Target</Label>
          <input type="text" ref="targetInput" placeholder="100" name="target" required/>
          <input type="submit" value="Save"/>
          <button onClick={() => {this.setState({currentView: 'home'})}} className="cancel">Cancel</button>
        </form>
      </div>
    )
  }

  onTotalInputChange(e) {
    e.preventDefault();
    let newState = this.state;
    console.log(this.refs.targetInput.value);
    newState.targetCount = this.refs.targetInput.value;
    newState.currentCount = 0;
    newState.previousTimes = [];
    newState.currentTime = 0;
    newState.currentView = 'home';
    this.setState(newState);
  }

  // render method is most important
  // render method returns JSX template
  render() {
    if (this.state.currentView == 'home') {
      return this.homeView();
    } else {
      return this.setupView();
    }
  }
}

// Render to ID content in the DOM
ReactDOM.render( <App/> ,
  document.getElementById('content')
);

function padNumber(num) {
  if (num < 10) {
    return "0" + num;
  }
  return num;
}
