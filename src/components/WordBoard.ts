interface Config {
	tiles: number;
	rows: number;
	submitKey?: string;
	backKey?: string;
	solution: string;
}

interface BoardState {
	boardState: string[][];
	submitted: boolean[];
}

interface RegisterEventsProps {
	onValidWord?: (result: LetterIndicator[]) => void;
	onInvalidWord?: () => void;
	onGameCompleted?: () => void;
}

export type LetterIndicator = 'notPresent' | 'present' | 'correct';

export class WordBoard {
	private numberOfTiles = 5;
	private numberOfRows = 6;
	private currentRowIdx = 0;
	private currentTileIdx = 0;
	private boardState: BoardState = { boardState: [], submitted: [] };
	private gameCompleted = false;
	private rowCompleted = false;
	SUBMIT_KEY = 'Enter';
	BACKSPACE_KEY = 'Back';
	private solution = '';
	private onInvalidWord: () => void = () =>
		console.log('Not implemented. Register onInvalidWord handler with add registerEvents method');
	private onValidWord: (result: LetterIndicator[]) => void = () =>
		console.log('not implemented.Register onValidWord handler with add registerEvents method');
	private onGameCompleted: () => void = () =>
		console.log(
			'not implemented.Register onGameCompleted event handler with add registerEvents method'
		);

	constructor(config: Config) {
		this.numberOfTiles = config.tiles;
		this.numberOfRows = config.rows;
		if (config.submitKey) this.SUBMIT_KEY = config.submitKey;
		if (config.backKey) this.BACKSPACE_KEY = config.backKey;
		this.solution = config.solution;

		if (config.solution.length !== config.tiles) {
			throw Error('Solution word must have same amount of characters as config.');
		}

		this.setupBoard();
	}

	registerEvents(obj: RegisterEventsProps): void {
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

	addLetter(key: string): BoardState {
		if (this.gameCompleted) {
			if (key === 'Enter') {
				this.submitWord();
				const indicators = this.getIndicatorsForCurrentRow();
				this.onValidWord(indicators);
				this.onGameCompleted();
			}
		} else if (this.rowCompleted) {
			if (key === 'Enter') {
				const word = this.boardState.boardState[this.currentRowIdx].join('');
				const isValid = WordBoard.checkValidWord(word);

				if (isValid) {
					this.submitWord();
					const indicators = this.getIndicatorsForCurrentRow();
					this.onValidWord(indicators);
				} else {
					this.onInvalidWord();
				}
				this.startNewRow();
			} else if (key == 'Back') {
				this.deleteLastLetter();
				this.rowCompleted = false;
			}
		} else {
			// Continue adding / removing letters
			if (WordBoard.isBackSpace(key) && this.isAllowedToBackSpace()) {
				this.deleteLastLetter();
			} else if (WordBoard.isAllowedKey(key)) {
				this.addInputToTile(key);

				this.updateGame();
			}
		}

		return this.boardState;
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
		if (!this.rowCompleted) {
			this.currentTileIdx--;
		}
		this.addInputToTile('');
	}

	private static isBackSpace(key: string): boolean {
		return key == 'Back';
	}

	private isAllowedToBackSpace(): boolean {
		// Check if we are not at the first letter
		return this.currentTileIdx != 0;
	}

	private static isAllowedKey(key: string): boolean {
		return !(key == 'Enter' || key == 'Back');
	}

	private addInputToTile(letter: string): void {
		this.boardState.boardState[this.currentRowIdx][this.currentTileIdx] = letter;
	}

	private submitWord(): void {
		this.boardState.submitted[this.currentRowIdx] = true;
	}

	private isRowCompleted(): boolean {
		return this.currentTileIdx == this.numberOfTiles - 1;
	}

	private isGameCompleted(): boolean {
		return (
			this.currentTileIdx == this.numberOfTiles - 1 && this.currentRowIdx == this.numberOfRows - 1
		);
	}

	private startNewRow(): void {
		this.rowCompleted = false;
		this.currentRowIdx++;
		this.currentTileIdx = 0;
	}

	private nextTile(): void {
		this.currentTileIdx++;
	}

	private updateGame(): void {
		if (this.isGameCompleted()) {
			this.gameCompleted = true;
		} else if (this.isRowCompleted()) {
			this.rowCompleted = true;
		} else {
			this.nextTile();
		}
	}

	private static checkValidWord(word: string) {
		return true;
	}

	private getIndicatorsForCurrentRow(): LetterIndicator[] {
		const letterArr = this.boardState.boardState[this.currentRowIdx];

		const result: LetterIndicator[] = [];

		for (let i = 0; i < letterArr.length; i++) {
			const char = letterArr[i];

			if (char === this.solution[i]) {
				result.push('correct');
			} else if (this.solution.includes(char)) {
				result.push('present');
			} else {
				result.push('notPresent');
			}
		}
		return result;
	}

	getBoardState(): BoardState {
		return this.boardState;
	}
}
