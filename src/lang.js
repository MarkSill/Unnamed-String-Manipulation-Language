var Lang;

(function() {
	"use strict";

	Lang = {
		run: (code = "", input = "") => {
			if (!code) {
				code = "h";
			}
			let output = "";
			let str;
			let index = 1;
			let escape = false;
			let stack = [];
			let cmd = (buffer) => {
				let func = stack.shift();
				let temp = (func || Lang.commandDefault)(buffer, input);
				if (typeof temp === "string") {
					output += temp;
				}
				return output;
			};
			for (let ch of code) {
				if (typeof str !== "string") {
					if (ch === "h") {
						cmd("Hello, world!");
					} else if (ch === "u") {
						stack.push(Lang.commandUpper);
					} else if (ch === "l") {
						stack.push(Lang.commandLower);
					} else if (ch === "\"") {
						str = "";
					} else if (ch === "'") {
						str = " ";
					}
					else if (ch === "\n" || ch === "\t" || ch === " ") {
						//do nothing
					} else {
						output = `Error: Invalid command "${ch}" at character ${index}.`;
						break;
					}
				} else {
					let c = ch;
					if (escape) {
						if (c === "n") {
							c = "\n";
						} else if (c === "t") {
							c = "\t";
						}
						str += c;
						escape = false;
					} else {
						if (c === "\\") {
							escape = true;
						} else if (c === "\"") {
							cmd(str);
							str = undefined;
						} else if (c === "'") {
							cmd(`${str} `);
							str = undefined;
						} else {
							str += c;
						}
					}
				}
				index++;
			}
			if (str) {
				cmd(str);
			}
			return output;
		},
		commandDefault: (buffer) => {
			return buffer;
		},
		commandUpper: (buffer) => {
			return buffer.toUpperCase();
		},
		commandLower: (buffer) => {
			return buffer.toLowerCase();
		}
	};
})();
