import * as React from "react";
import "./App.css";
import { Button } from "ui";
import { GameWindow } from "./GameWindow";

function App() {
  return (
    <div id={"App"}>
      <GameWindow id={1} />
    </div>
  );
}

export default App;
