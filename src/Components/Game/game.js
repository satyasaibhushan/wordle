import React from "react";
import "./game.css";
import KeyBoard from "../KeyBoard/keyboard";
import GameBoard from "../GameBoard/gameboard";

export default function Game(props) {
	return (
		<div id="Game">
			<header id="GameHead"></header>
			<div id="GameBoardContainer">
				<GameBoard noOfRows={6} noOfCols={5} />
			</div>

			<KeyBoard heigh={"27vh"} />
		</div>
	);
}
