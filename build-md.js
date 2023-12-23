const fs = require('fs');
const FIGURES = 5;
let output = '';

const parseLines = (text) => text.trim().split(/\n/).map(line => {
	const values = line.trim().split(/\s*\|\s*/).map(item => {
		const angle = item.split(/\s+/).map((v, i) => v*60**-i).reduce((a, b) => a + b);
		return angle;
	});
	return values;
});

const print = (...args) => {
	const line = args.map(arg => {
		if (typeof arg === 'number') {
			return Number(arg.toPrecision(FIGURES));
		}
		return arg;
	}).join('');
	output += line + '\n';
};

const tableLine = (values) => {
	const args = [ '| ' ];
	for (const val of values) {
		args.push(val, ' | ');
	}
	args[args.length - 1] = ' |';
	print(...args);
};

const tableHeaders = (...args) => {
	print(`| ${args.join(' | ')} |`);
	print(`| ${args.map(() => '-').join(' | ')} |`);
};

const EARTH_RADIUS = 6371;
const SUN_DIST = 150e6;

const almanac_lines_raw = `
	18 |  89 35.5 | 7 35.2 |  89 54.4 | 7 48.9 | 0 60.9
	19 | 104 35.6 | 7 36.2 | 104 23.2 | 8 06.3 | 0 60.9
`;

const lines = parseLines(almanac_lines_raw);
const [ _HR1, SUN_GHA_1, SUN_DEC_1, MOON_GHA_1, MOON_DEC_1, MOON_HP_1 ] = lines[0];
const [ _HR2, SUN_GHA_2, SUN_DEC_2, MOON_GHA_2, MOON_DEC_2, MOON_HP_2 ] = lines[1];
const SUN_GHA_D = SUN_GHA_2 - SUN_GHA_1;
const MOON_GHA_D = MOON_GHA_2 - MOON_GHA_1;

print('# Flat Earth Challenge\n');
print('## Constants\n');
print('- Earth radius: `', EARTH_RADIUS, '`');
print('- Sun distance: `', SUN_DIST, '`');
print('\n## Almanac data\n');
tableHeaders('Hour', 'Sun GHA', 'Sun Dec.', 'Moon GHA', 'Moon Dec.', 'Moon HP');
tableLine(lines[0]);
tableLine(lines[1]);
print('\n## Calculations\n');
print('### Time');
print('$$');
print('GHA_{sun} = ', SUN_GHA_1);
print('$$');

console.log(output);
fs.writeFileSync('./script.md', output);
