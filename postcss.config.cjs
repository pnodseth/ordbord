const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const fix =   require("postcss-100vh-fix")
const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(),
		//But others, like autoprefixer, need to run after,
		autoprefixer,
    fix
	]
};

module.exports = config;
