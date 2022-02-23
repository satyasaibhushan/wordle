import React, { useState, useReducer } from "react";
import "./game.css";
import KeyBoard from "../KeyBoard/keyboard";
import GameBoard from "../GameBoard/gameboard";
let noOfRows = 6,
	noOfCols = 5;
let initialBoard = [...Array(noOfRows)].map((e) => [...Array(noOfCols)].map((ele) => ""));
let setVal = (arr, i, j, val) => {
	return arr.map((innerArray, x) => {
		if (x === i)
			return innerArray.map((item, y) => {
				if (y === j) return val;
				return item;
			});
		return innerArray;
	});
};

const reducer = (state, action) => {
	switch (action.type) {
		case "enter":
			if (action.currentCol != noOfCols) {
				console.log("not a complete word");
				return state;
			} else {
				console.log("entered a word", action.boardData[action.currentRow].join(""));
				if (action.currentRow != noOfRows - 1) {
					action.setRow(action.currentRow + 1);
					action.setCol(0);
				} else console.log("game over");
				return state;
			}
		case "delete":
			if (action.currentCol === 0) {
				console.log("empty word");
				return state;
			} else {
				action.setCol(action.currentCol - 1);
				return setVal(state, action.currentRow, action.currentCol - 1, "");
			}
		case "key":
			if (action.currentCol == noOfCols) {
				console.log("word already filled", action.currentCol);
				return state;
			} else {
				action.setCol(action.currentCol + 1);
				return setVal(state, action.currentRow, action.currentCol, action.value);
			}
	}
};

export default function Game(props) {
	let [currentRow, setRow] = useState(0);
	let [currentCol, setCol] = useState(0);

	const [boardData, setBoard] = useReducer(reducer, initialBoard);

	let enterKey = (key) => {
		if (key === "enter" || key == "delete") setBoard({ type: key, currentCol, currentRow, setCol, setRow, boardData });
		else {
			setBoard({ type: "key", value: key, currentCol, currentRow, setCol, setRow, boardData });
		}
	};
	console.log(currentRow, currentCol);

	return (
		<div id="Game">
			<header id="GameHead"></header>
			<div id="GameBoardContainer">
				<GameBoard
					noOfRows={noOfRows}
					noOfCols={noOfCols}
					currentRow={currentRow}
					curretCol={currentCol}
					boardData={boardData}
				/>
			</div>
			<KeyBoard height={"27vh"} onKey={(key) => enterKey(key)} />
		</div>
	);
}
