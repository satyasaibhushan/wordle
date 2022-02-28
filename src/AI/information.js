//E = Σp(x)*log2(1/p(x));
import { validGuesses } from "../utils/validGuesses";
import { answers } from "../utils/answers";

let getEvaluation = (guess, correct) => {
	let pattern = "";
	//same logic
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

let populateDist = (object, word, ele) => {
	let pattern = getEvaluation(word, ele);
	// console.log(pattern);
	if (object[pattern]) object[pattern]++;
	else object[pattern] = 1;
};

export default function getE(word, useAnswerList = false) {
	//useAnswerlist-> are only answers allowed as final result
	let distributions = {};
	if (!useAnswerList) validGuesses.forEach((ele) => populateDist(distributions, word, ele));
	else answers.forEach((ele) => populateDist(distributions, word, ele));
	let n = useAnswerList ? answers.length : validGuesses.length;
	let E = 0;
	for (let key in distributions) {
		E += (distributions[key] / n) * Math.log2(n / distributions[key]);
	}
	return E;
}

export function bestE() {
	let bestWord = validGuesses[0];
	let bestE = 0;
	let percent = 0;
	let n = validGuesses.length;
	validGuesses.forEach((ele, i) => {
		let eleE = getE(ele, true);
		if (i % Math.floor(n / 100) == 0) console.log(percent++, "%");
		// console.log(ele, eleE);
		if (eleE > bestE) {
			bestE = eleE;
			bestWord = ele;
		}
	});
	console.log("winner", bestE, bestWord);
	return;
}
