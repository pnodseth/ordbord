import { WordBoard } from '../components/WordBoard';

test('Initial boardstate to be empty strings', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	const expected: string[][] = [];
	for (let i = 0; i < rows; i++) {
		const row = Array.from({ length: wordLength }, () => '');
		expected.push(row);
	}

	console.log(expected);
	expect(board.boardState.boardState).toEqual(expected);
});

test('Initial board state to have false submit checks', () => {
	const wordLength = 7;
	const board = new WordBoard({ rows: 6, solution: 'jirasas', tiles: wordLength });

	const expected = Array.from({ length: wordLength }, () => false);
	expect(board.boardState.submitted).toEqual(expected);
});

test('Adding q as first letter produces new board state', () => {
	const board = new WordBoard({ rows: 6, solution: 'jirar', tiles: 5 });
	board.addLetter('q');
	const expected = [
		['q', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	console.log(board.boardState.boardState);

	expect(board.boardState.boardState).toEqual(expected);
});

test('Enter should be disabled until end of row', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.addLetter('q');
	const { updatedBoardState } = board.addLetter('Enter');

	const expected = [
		['q', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	expect(updatedBoardState.boardState).toEqual(expected);
});

test('Back should remove previously added letter', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.addLetter('q');
	const { updatedBoardState } = board.addLetter('Back');

	const expected = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	expect(updatedBoardState.boardState).toEqual(expected);
});

test('Expect first row to have submitted state after row complete', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.addLetter('q');
	board.addLetter('q');
	board.addLetter('q');
	board.addLetter('q');
	board.addLetter('q');
	const { updatedBoardState } = board.addLetter('Enter');

	const expected = [true, false, false, false, false];
	expect(updatedBoardState.submitted).toEqual(expected);
});

test('Expect onValidWord event to be triggered after row complete', () => {
	const wordLength = 5;
	const rows = 6;
	const expected = 'it works!';
	let eventString = '';

	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.registerEvents({
		onValidWord: () => (eventString = expected)
	});

	board.addLetter('q');
	board.addLetter('q');
	board.addLetter('q');
	board.addLetter('q');
	board.addLetter('q');
	board.addLetter('Enter');
	expect(eventString).toBe(expected);
});

/*test("Expect onInvalid event to be triggerd after submitting invalid word", () => {

})*/
