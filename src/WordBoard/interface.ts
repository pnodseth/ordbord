export interface Config {
	tiles: number;
	rows: number;
	submitKey?: string;
	backKey?: string;
	wordIdx: number;
	boardState?: BoardState;
}

export interface BoardState {
	boardState: string[][];
	submitted: boolean[];
}

export interface RegisterEventsProps {
	onValidWord?: (result: LetterIndicator[], keyIndicators: KeyIndicator) => void;
	onInvalidWord?: (word: string, roxIdx: number) => void;
	onGameCompleted?: (correct: boolean, word: string) => void;
}

export interface KeyIndicator {
	[key: string]: LetterIndicator;
}

export type LetterIndicator = 'notPresent' | 'present' | 'correct';

export interface Result {
	wordIdx: number;
	rowIndicators: LetterIndicator[][];
	state: UiState;
	boardState: BoardState;
	keyIndicators: KeyIndicator;
	solution: string;
}

export type UiState = 'idle' | 'fail' | 'won';
