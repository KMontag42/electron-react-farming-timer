// ES6 Component
import React from 'react';
import ReactDOM from 'react-dom';

// Search component created as a class
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to Hotreacton</h1>
        <p>Ya dingus</p>
      </div>
    )
  }
}

// Render to ID content in the DOM
ReactDOM.render(
  <App/> ,
  document.getElementById('content')
);
