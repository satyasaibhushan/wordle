import React, { useReducer, useEffect, useRef } from "react";
import "./game.css";
import KeyBoard from "../KeyBoard/keyboard";
import GameBoard from "../GameBoard/gameboard";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let noOfRows = 6,
	noOfCols = 5;
let initialBoard = {
	board: [...Array(noOfRows)].map((e) => [...Array(noOfCols)].map((ele) => "")),
	evaluation: [...Array(noOfRows)].map((e) => [...Array(noOfCols)].map((ele) => "")),
	currentCol: 0,
	currentRow: 0,
	isOver: false,
};
let correctWord = "apple";
let keyData = [...Array(26)].map((_) => -1);

const isValid = (key) => {
	return (/[a-zA-Z]/.test(key) && key.length === 1) || key === "Enter" || key === "Backspace";
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

let setKeyData = (guess, evaluation) => {
	guess = guess.split("");
	for (let i = 0; i < guess.length; i++) {
		const element = guess[i].charCodeAt(0) - "a".charCodeAt(0);
		if (keyData[element] === 2) continue;
		else if (keyData[element] === 0) continue;
		else {
			if (keyData[element] === 1 && evaluation[i] === 2) keyData[element] = 2;
			else if (keyData[element] === -1) keyData[element] = evaluation[i];
		}
	}
};

const reducer = (state, action) => {
	switch (action.type) {
		case "Enter":
			if (action.currentCol !== noOfCols) {
				if (!toast.isActive("incomplete")) {
					toast("not a complete word", {
						toastId: "incomplete",
					});
				}
				// console.log("not a complete word");
				return state;
			} else {
				let enteredWord = action.board[action.currentRow].join("");
				console.log(`entered a word "${enteredWord}"`);

				let result = getEvaluation(enteredWord, correctWord);
				setKeyData(enteredWord, result);
				// console.log(result);
				action.evaluation.splice(action.currentRow, 1, result);
				if (result.every((val) => val === 2) || action.currentRow >= noOfRows - 1) {
					action.currentRow < noOfRows - 1
						? toast("Hurray!!", {
								toastId: "success",
						  })
						: toast(`Word is "${correctWord}" `, {
								toastId: "loss",
						  });
					// console.log("game over");
					return {
						...state,
						evaluation: action.evaluation,
						currentCol: 0,
						currentRow: action.currentRow + 1,
						isOver: true,
					};
				}
				return {
					...state,
					evaluation: action.evaluation,
					currentCol: 0,
					currentRow: action.currentRow + 1,
				};
			}
		case "Backspace":
			if (action.currentCol === 0) {
				if (!toast.isActive("emptyWord")) {
					toast("Empty word", {
						toastId: "emptyWord",
					});
				}
				// console.log("empty word");
				return state;
			} else {
				return {
					...state,
					currentCol: action.currentCol - 1,
					board: setVal(state.board, action.currentRow, action.currentCol - 1, ""),
				};
			}
		case "key":
			if (action.currentCol === noOfCols) {
				if (!toast.isActive("alreadyFilled")) {
					toast("word already filled", {
						toastId: "alreadyFilled",
					});
				}
				// console.log("word already filled", action.currentCol);
				return state;
			} else {
				return {
					...state,
					currentCol: action.currentCol + 1,
					board: setVal(state.board, action.currentRow, action.currentCol, action.value),
				};
			}
		default:
			return state;
	}
};

export default function Game(props) {
	let [boardData, setBoard] = useReducer(reducer, initialBoard);
	let currentDataRef = useRef(boardData);

	let processKey = (key) => {
		if (!boardData.isOver) {
			if (key === "Enter" || key === "Backspace") setBoard({ type: key, ...currentDataRef.current });
			else setBoard({ type: "key", value: key, ...currentDataRef.current });
		}
	};
	let handleEvent = (e) => {
		if (e.key === "Enter") e.preventDefault();
		if (isValid(e.key)) processKey(e.key);
	};

	useEffect(() => {
		currentDataRef.current = boardData;
	}, [boardData]);

	useEffect(() => {
		if (boardData.isOver) {
			document.removeEventListener("keydown", handleEvent);
		} else {
			document.addEventListener("keydown", handleEvent);
		}
		return () => {
			document.removeEventListener("keydown", handleEvent);
		};
	}, [boardData.isOver]);

	return (
		<div id="Game">
			<header id="GameHead"> Wordle</header>
			<div id="GameBoardContainer">
				<GameBoard noOfRows={noOfRows} noOfCols={noOfCols} boardData={boardData} />
			</div>
			<KeyBoard height={"27vh"} onKey={(key) => processKey(key)} isOver={boardData.isOver} keyData={keyData} />
			<ToastContainer
				position="top-center"
				autoClose={2000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover={false}
				transition={Slide}
				limit={3}
				closeButton={false}
			/>
		</div>
	);
}
