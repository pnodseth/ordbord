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

interface ReturnData {
	updatedBoardState: BoardState;
	gameCompleted: boolean;
	rowCompleted: boolean;
}

interface RegisterEventsProps {
	onValidWord?: () => void;
	onInvalidWord?: () => void;
	onGameCompleted?: () => void;
}

export class WordBoard {
	numberOfTiles = 5;
	numberOfRows = 6;
	currentRowIdx = 0;
	currentTileIdx = 0;
	boardState: BoardState = { boardState: [], submitted: [] };
	gameCompleted = false;
	rowCompleted = false;
	SUBMIT_KEY = 'Enter';
	BACKSPACE_KEY = 'Back';
	solution = '';
	private onInvalidWord: () => void = () =>
		console.log('Not implemented. Register onInvalidWord handler with add registerEvents method');
	private onValidWord: () => void = () =>
		console.log('not implemented.Register onInvalidWord handler with add registerEvents method');
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

	registerEvents(obj: RegisterEventsProps) {
		if (typeof obj.onValidWord === 'function') {
			this.onValidWord = obj.onValidWord;
		}
		if (typeof obj.onInvalidWord === 'function') {
			this.onInvalidWord = obj.onInvalidWord;
		}
	}

	addLetter(key: string): ReturnData {
		const returnData = {
			updatedBoardState: null,
			gameCompleted: false,
			rowCompleted: false
		};

		if (this.gameCompleted) {
			if (key === 'Enter') {
				this.submitWord();
				console.log('Thank you for playing!');
			}
		} else if (this.rowCompleted) {
			if (key === 'Enter') {
				const word = this.boardState.boardState[this.currentRowIdx].join('');
				const isValid = this.checkValidWord(word);

				if (isValid) {
					this.submitWord();
					this.startNewRow();

					if (typeof this.onValidWord === 'function') {
						this.onValidWord();
					}
				} else {
					//todo: Add event onInvalidWord
					if (this.onInvalidWord) {
						this.onInvalidWord();
					}
				}
			} else if (key == 'Back') {
				this.deleteLastLetter();
				this.rowCompleted = false;
			}
		} else {
			// Continue adding / removing letters
			if (this.isBackSpace(key) && this.isAllowedToBackSpace()) {
				this.deleteLastLetter();
			} else if (this.isAllowedKey(key)) {
				this.addInputToTile(key);

				this.updateGame();
			}
		}
		returnData.updatedBoardState = this.boardState;
		returnData.gameCompleted = this.gameCompleted;
		returnData.rowCompleted = this.rowCompleted;
		return returnData;
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

	private isBackSpace(key: string): boolean {
		return key == 'Back';
	}

	private isAllowedToBackSpace(): boolean {
		// Check if we are not at the first letter
		return this.currentTileIdx != 0;
	}

	private isAllowedKey(key: string): boolean {
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
			console.log('Game is completed');
		} else if (this.isRowCompleted()) {
			console.log('Row is completed');
			this.rowCompleted = true;
		} else {
			this.nextTile();
		}
	}

	private checkValidWord(word: string) {
		return true;
	}
}
