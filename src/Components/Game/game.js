import React, { useState, useReducer, useEffect, useRef } from "react";
import "./game.css";
import KeyBoard from "../KeyBoard/keyboard";
import GameBoard from "../GameBoard/gameboard";
let noOfRows = 6,
	noOfCols = 5;
let initialBoard = {
	board: [...Array(noOfRows)].map((e) => [...Array(noOfCols)].map((ele) => "")),
	evaluation: [...Array(noOfRows)].map((e) => [...Array(noOfCols)].map((ele) => "")),
	currentCol: 0,
	currentRow: 0,
};
let correctWord = "apple";

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

let getEvaluation = (guess, correct) => {
	//0 => not present => black
	//1 => present => yellow
	//2 => correct => green
	guess = guess.split("");
	return guess.map((ele, i) => {
		if (correct[i] === ele) {
			correct = correct.replace(ele, " ");
			return 2;
		} else if (correct.includes(ele)) {
			correct = correct.replace(ele, " ");
			return 1;
		} else return 0;
	});
};

const reducer = (state, action) => {
	switch (action.type) {
		case "Enter":
			if (action.currentCol != noOfCols) {
				console.log("not a complete word");
				return state;
			} else {
				let enteredWord = action.board[action.currentRow].join("");
				console.log("entered a word", enteredWord);
				if (action.currentRow != noOfRows - 1) {
					let result = getEvaluation(enteredWord, correctWord);
					console.log(result);
					if (result.every((val) => val === 2)) console.log("game over");
					action.evaluation.splice(action.currentRow, 1, result);
					return {
						...state,
						evaluation: action.evaluation,
						currentCol: 0,
						currentRow: action.currentRow + 1,
					};
				} else {
					console.log("game over");
					return { ...state, currentRow: action.currentRow + 1 };
				}
			}
		case "Backspace":
			if (action.currentCol === 0) {
				console.log("empty word");
				return state;
			} else {
				return {
					...state,
					currentCol: action.currentCol - 1,
					board: setVal(state.board, action.currentRow, action.currentCol - 1, ""),
				};
			}
		case "key":
			if (action.currentCol == noOfCols) {
				console.log("word already filled", action.currentCol);
				return state;
			} else {
				return {
					...state,
					currentCol: action.currentCol + 1,
					board: setVal(state.board, action.currentRow, action.currentCol, action.value),
				};
			}
	}
};

export default function Game(props) {
	let [boardData, setBoard] = useReducer(reducer, initialBoard);
	let currentDataRef = useRef(boardData);

	let processKey = (key) => {
		if (key === "Enter" || key == "Backspace") setBoard({ type: key, ...currentDataRef.current });
		else setBoard({ type: "key", value: key, ...currentDataRef.current });
	};
	console.log(boardData);

	useEffect(() => {
		currentDataRef.current = boardData;
	}, [boardData]);

	useEffect(() => {
		document.addEventListener("keydown", (e) => {
			if (e.key === "Enter") e.preventDefault();
			if (isValid(e.key)) processKey(e.key);
		});
		return () => {
			document.removeEventListener("keydown", (e) => {
				if (e.key === "Enter") e.preventDefault();
				if (isValid(e.key)) processKey(e.key);
			});
		};
	}, []);

	return (
		<div id="Game">
			<header id="GameHead"> Wordle</header>
			<div id="GameBoardContainer">
				<GameBoard noOfRows={noOfRows} noOfCols={noOfCols} boardData={boardData} />
			</div>
			<KeyBoard height={"27vh"} onKey={(key) => processKey(key)} />
		</div>
	);
}
