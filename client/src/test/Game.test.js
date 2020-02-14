import React from 'react';
import ReactDOM from "react-dom";
import Game from "../components/Game";

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(<Game />, div);
});
