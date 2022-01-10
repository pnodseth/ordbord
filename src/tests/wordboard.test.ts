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
	const { boardState } = board.getBoardState();
	expect(boardState).toEqual(expected);
});

test('Initial board state to have false submit checks', () => {
	const wordLength = 7;
	const board = new WordBoard({ rows: 6, solution: 'jirasas', tiles: wordLength });

	const { submitted } = board.getBoardState();
	const expected = Array.from({ length: wordLength }, () => false);
	expect(submitted).toEqual(expected);
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

	const { boardState } = board.getBoardState();
	expect(boardState).toEqual(expected);
});

test('Enter should be disabled until end of row', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.addLetter('q');
	const { boardState } = board.addLetter('Enter');

	const expected = [
		['q', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	expect(boardState).toEqual(expected);
});

test('Back should remove previously added letter', () => {
	const wordLength = 5;
	const rows = 6;
	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.addLetter('q');
	const { boardState } = board.addLetter('Back');

	const expected = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	expect(boardState).toEqual(expected);
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
	const { submitted } = board.addLetter('Enter');

	const expected = [true, false, false, false, false];
	expect(submitted).toEqual(expected);
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

test('Expect onGameCompleted event to be triggered after row complete', () => {
	const wordLength = 5;
	const rows = 6;
	const expected = 'game is now completed!';
	let eventString = '';

	const board = new WordBoard({ rows, solution: 'jiras', tiles: wordLength });

	board.registerEvents({
		onGameCompleted: () => {
			eventString = expected;
		}
	});

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < wordLength; j++) {
			board.addLetter('q');
		}
		board.addLetter('Enter');
	}

	expect(eventString).toBe(expected);
});

test('Expect valid row submission to produce array of correct letter indicators', () => {
	const wordLength = 5;
	const rows = 6;
	const solution = 'prism';
	const expected = ['present', 'correct', 'present', 'notPresent', 'correct'];
	let result;
	const board = new WordBoard({ rows, solution, tiles: wordLength });
	board.registerEvents({
		onValidWord: (r) => {
			result = r;
		}
	});
	board.addLetter('i');
	board.addLetter('r');
	board.addLetter('p');
	board.addLetter('f');
	board.addLetter('m');
	board.addLetter('Enter');

	expect(result).toEqual(expected);
});
