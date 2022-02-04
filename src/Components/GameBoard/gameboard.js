import React from "react";
import "./gameboard.css";

export default function GameBoard({ noOfRows, noOfCols }) {
	return (
		<div id="GameBoard">
			{[...Array(noOfRows)].map((_, i) => {
				return (
					<div className="GameBoardRow" style={{gridTemplateColumns: `repeat(5,1fr)`}}>
						{[...Array(noOfCols)].map((_, j) => {
						return	(
                            <div className="GameBoardTile">

                            </div>)
						})}
					</div>
				);
			})}
		</div>
	);
}
