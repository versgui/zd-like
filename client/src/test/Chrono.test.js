import React from 'react';
import ReactDOM from "react-dom";
import Chrono from "../components/Chrono";

test('renders without crashing', () => {
  const p = document.createElement('p');

  ReactDOM.render(<Chrono />, p);
});
