import React, { useState, useReducer, useEffect, useRef } from "react";
import "./game.css";
import KeyBoard from "../KeyBoard/keyboard";
import GameBoard from "../GameBoard/gameboard";
let noOfRows = 6,
	noOfCols = 5;
let initialBoard = [...Array(noOfRows)].map((e) => [...Array(noOfCols)].map((ele) => ""));

const isValid = (key) => {
	return (/[a-zA-Z]/.test(key) && key.length == 1) || key === "Enter" || key == "Backspace";
};
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
		case "Enter":
			if (action.currentCol != noOfCols) {
				console.log("not a complete word");
				return state;
			} else {
				console.log("entered a word", action.boardData[action.currentRow].join(""));
				action.setRow(action.currentRow + 1);
				if (action.currentRow != noOfRows - 1) {
					action.setCol(0);
				} else {
					console.log("game over");
				}
				return state;
			}
		case "Backspace":
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
	let [currentRow, _setRow] = useState(0);
	let [currentCol, _setCol] = useState(0);

	let currentRowRef = useRef(currentRow);
	const setRow = (val) => {
		currentRowRef.current = val;
		_setRow(val);
	};
	let currentColRef = useRef(currentCol);
	const setCol = (val) => {
		currentColRef.current = val;
		_setCol(val);
	};

	const [boardData, setBoard] = useReducer(reducer, initialBoard);

	let currentDataRef = useRef(boardData);

	// console.log(currentDataRef.current);

	let getState = () => {
		return {
			currentCol: currentColRef.current,
			currentRow: currentRowRef.current,
			setCol,
			setRow,
			boardData: currentDataRef.current,
		};
	};

	let processKey = (key) => {
		if (key === "Enter" || key == "Backspace") setBoard({ type: key, ...getState() });
		else setBoard({ type: "key", value: key, ...getState() });
	};

	useEffect(() => {
		currentDataRef.current = boardData;
	}, [boardData]);

	useEffect(() => {
		let listner = document.addEventListener("keydown", (e) => {
			if (e.key === "Enter") e.preventDefault();
			if (isValid(e.key)) processKey(e.key);
		});
		return () => {
			listner.remove();
		};
	}, []);

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
			<KeyBoard height={"27vh"} onKey={(key) => processKey(key)} />
		</div>
	);
}
