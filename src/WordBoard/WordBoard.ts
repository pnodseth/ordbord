import type { BoardState, Config, KeyIndicator, LetterIndicator } from './interface';
import dictionary from './filtered.json';
import solutions from './solutions.json';

export class WordBoard {
	private numberOfTiles = 5;
	private numberOfRows = 6;
	private currentRowIdx = 0;
	private currentTileIdx = 0;
	private boardState: BoardState = { boardState: [], submitted: [] };
	private solutionWord = '';
	private gameEnded = false;
	SUBMIT_KEY = 'enter';
	BACKSPACE_KEY = 'backspace';
	dict = dictionary['5'];

	private onInvalidWord: (word: string, rowIdx: number) => void = () =>
		console.log('Not implemented. Register onInvalidWord handler with add registerEvents method');
	private onValidWord: (result: LetterIndicator[], keyIndicators: KeyIndicator) => void = () =>
		console.log('not implemented.Register onValidWord handler with add registerEvents method');
	private onGameCompleted: (
		correct: boolean,
		word: string,
		indicatorRow: LetterIndicator[]
	) => void = () =>
		console.log(
			'not implemented.Register onGameCompleted event handler with add registerEvents method'
		);
	private keyIndicators: KeyIndicator = {};
	private solutions: string[];

	constructor(config: { tiles: number; boardState: BoardState; wordIdx: number; rows: number }) {
		this.dict = dictionary[config.tiles.toString()];
		this.solutions = solutions;

		if (typeof config.wordIdx === 'undefined' || config.wordIdx === null) {
			this.setRandomWord();
		} else {
			this.solutionWord = this.solutions[config.wordIdx];
		}
		this.numberOfTiles = config.tiles;
		this.numberOfRows = config.rows;

		/*if (this.solutionWord.length !== config.tiles) {
			throw Error('Solution word must have same amount of characters as config.');
		}*/

		if (config.boardState) {
			this.boardState = config.boardState;
		} else {
			this.setupBoard();
		}
	}

	registerEvents(obj: {
		onValidWord: (result, keyInd) => void;
		onGameCompleted: (result: boolean, word: string, indicatorRow: LetterIndicator[]) => void;
		onInvalidWord: (word, rowIdx) => void;
	}): void {
		if (typeof obj.onValidWord === 'function') {
			this.onValidWord = obj.onValidWord;
		}
		if (typeof obj.onInvalidWord === 'function') {
			this.onInvalidWord = obj.onInvalidWord;
		}
		if (typeof obj.onGameCompleted === 'function') {
			this.onGameCompleted = obj.onGameCompleted;
		}
	}

	addLetter(k: string): BoardState | undefined {
		const key = k.toLowerCase();

		if (!this.isAllowedKey(key)) {
			return;
		}
		if (this.gameEnded) {
			return;

			// Game Completed
		} else if (this.isRowCompleted()) {
			if (key === this.SUBMIT_KEY) {
				const word = this.boardState.boardState[this.currentRowIdx].join('');
				const isValid = this.checkValidWord(word);

				if (isValid) {
					this.submitWord();
					const rowIndicators = this.getIndicatorsForCurrentRow();

					this.onValidWord(rowIndicators, this.keyIndicators);

					if (WordBoard.isCorrectAnswer(rowIndicators) || this.isGameCompleted()) {
						this.onGameCompleted(
							WordBoard.isCorrectAnswer(rowIndicators),
							this.solutionWord,
							rowIndicators
						);
						this.gameEnded = true;
					}

					this.startNewRow();
				} else {
					this.onInvalidWord(word, this.currentRowIdx);
				}
			} else if (key == this.BACKSPACE_KEY) {
				this.deleteLastLetter();
			}
		} else {
			// Continue adding / removing letters
			if (key === this.BACKSPACE_KEY && this.isAllowedToBackSpace()) {
				this.deleteLastLetter();
			} else if (this.isInputKey(key)) {
				this.addInputToTile(key);

				this.nextTile();
			}
		}

		return this.boardState;
	}

	private static isCorrectAnswer(indicators: LetterIndicator[]) {
		return !indicators.includes('present') && !indicators.includes('notPresent');
	}

	private setupBoard(): void {
		for (let i = 0; i < this.numberOfRows; i++) {
			if (!this.boardState.boardState[i]) {
				this.boardState.boardState[i] = [];
			}
			for (let j = 0; j < this.numberOfTiles; j++) {
				if (!this.boardState.boardState[i][j]) {
					this.boardState.boardState[i][j] = '';
				}
				this.boardState.boardState[i][j] = '';
			}
		}

		// Set initial submit checks
		for (let i = 0; i < this.numberOfTiles; i++) {
			this.boardState.submitted[i] = false;
		}
	}

	private deleteLastLetter(): void {
		this.currentTileIdx--;
		this.addInputToTile('');
	}

	private isAllowedToBackSpace(): boolean {
		// Check if we are not at the first letter
		return this.currentTileIdx != 0;
	}

	private isInputKey(key) {
		return this.getInputKeys().includes(key);
	}

	private getInputKeys() {
		const norwegian = ['??', '??', '??'];
		const english = [
			'q',
			'w',
			'e',
			'r',
			't',
			'y',
			'u',
			'i',
			'o',
			'p',
			'a',
			's',
			'd',
			'f',
			'g',
			'h',
			'j',
			'k',
			'l',
			'z',
			'x',
			'c',
			'v',
			'b',
			'n',
			'm'
		];
		return [...norwegian, ...english];
	}

	private isAllowedKey(key: string): boolean {
		const actions = [this.SUBMIT_KEY, this.BACKSPACE_KEY];
		const inputKeys = this.getInputKeys();
		return [...inputKeys, ...actions].includes(key.toLowerCase());
	}

	private addInputToTile(letter: string): void {
		this.boardState.boardState[this.currentRowIdx][this.currentTileIdx] = letter;
	}

	private submitWord(): void {
		this.boardState.submitted[this.currentRowIdx] = true;
	}

	private isRowCompleted(): boolean {
		return this.currentTileIdx == this.numberOfTiles;
	}

	private isGameCompleted(): boolean {
		return this.currentTileIdx == this.numberOfTiles && this.currentRowIdx == this.numberOfRows - 1;
	}

	private startNewRow(): void {
		this.currentRowIdx++;
		this.currentTileIdx = 0;
	}

	private nextTile(): void {
		this.currentTileIdx++;
	}

	private checkValidWord(word: string) {
		return this.dict.includes(word);
	}

	private getIndicatorsForCurrentRow(): LetterIndicator[] {
		const letterArr = [...this.boardState.boardState[this.currentRowIdx]];
		const solutionCopy = [...this.solutionWord];

		const result: LetterIndicator[] = [];
		/*
		 * Avgitt : koker
		 * Riktig ord: koser
		 * P?? K nr to: Dersom antallet
		 * */

		/*Check for green letters*/
		for (let i = 0; i < this.solutionWord.length; i++) {
			const char = letterArr[i];
			if (char && char === solutionCopy[i]) {
				result[i] = 'correct';
				this.keyIndicators[char] = 'correct';

				letterArr[i] = undefined;
				solutionCopy[i] = undefined;
			}
		}

		/*Check for yellow letters*/
		for (let i = 0; i < this.solutionWord.length; i++) {
			const char = letterArr[i];
			if (char && solutionCopy.includes(char)) {
				result[i] = 'present';
				this.keyIndicators[char] = 'present';
				letterArr[i] = undefined;
				solutionCopy[solutionCopy.indexOf(char)] = undefined;
			}
		}
		/* Not present letters*/
		for (let i = 0; i < this.solutionWord.length; i++) {
			const char = letterArr[i];
			if (char) {
				result[i] = 'notPresent';
				if (!this.keyIndicators[char]) {
					this.keyIndicators[char] = 'notPresent';
				}
			}
		}

		return result;
	}

	getBoardState(): BoardState {
		return this.boardState;
	}

	setRandomWord(): void {
		const rnd = Math.floor(Math.random() * (this.solutions.length - 1) + 1);
		this.solutionWord = this.solutions[rnd];
	}

	getHint(): string {
		return this.solutionWord[this.currentTileIdx];
	}
}
