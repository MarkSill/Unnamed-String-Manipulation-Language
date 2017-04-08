var Lang;

(function() {
	"use strict";


	let first;
	let second;

	Lang = {
		run: (code = "", input = "", debug = undefined) => {
			if (!code) {
				code = "h";
			}
			let output = "";
			let str;
			let nStr;
			let index = 1;
			let escape = false;
			let stack = [];
			let comment = false;

			first = undefined;
			second = undefined;

			let cmd = (buffer) => {
				if (stack.length === 0) {
					stack.push({
						cmd: Lang.commandDefault,
						index: index,
						needs: [""]
					});
				}
				oldCmd(buffer);
			};
			let oldCmd = (buffer) => {
				let func = stack[stack.length - 1];
				//TODO: Arg type checking.
				if (!func.args) {
					func.args = [];
				}
				func.args.push(buffer);
				if (func.args.length === func.needs.length) {
					stack.pop();
					buffer = func.cmd(func.args, input);
					if (debug && func.debug !== false) {
						debug(output, func.index - 1, func.lastIndex || func.index);
					}
					if (stack.length) {
						oldCmd(buffer);
					} else {
						if (buffer !== undefined) {
							output += buffer;
						}
					}
				}
			};
			for (let index = 0; index < code.length; index++) {
				let ch = code[index];
				if (comment) {
					if (ch === "\n") {
						comment = false;
					}
					continue;
				}
				if (nStr) {
					if (!isNaN(parseInt(ch))) {
						nStr += ch;
					} else {
						let n = parseInt(nStr);
						cmd(n);
						nStr = undefined;
					}
				}
				if (typeof str !== "string" && !nStr && !comment) {
					if (ch === "h") {
						cmd("Hello, world!");
					} else if (ch === "u") {
						stack.push({
							cmd: Lang.commandUpper,
							index: index,
							needs: [""]
						});
					} else if (ch === "l") {
						stack.push({
							cmd: Lang.commandLower,
							index: index,
							needs: [""]
						});
					} else if (ch === "s") {
						stack.push({
							cmd: Lang.commandSubstringOne,
							index: index,
							needs: [0, ""]
						});
					} else if (ch === "S") {
						stack.push({
							cmd: Lang.commandSubstringTwo,
							index: index,
							needs: [0, "", 0]
						});
					} else if (ch === "i") {
						cmd(input);
					} else if (ch === "q") {
						cmd(code);
					} else if (ch === "E") {
						break;
					} else if (ch === "c") {
						cmd(code[++index]);
					} else if (ch === "f") {
						stack.push({
							cmd: Lang.commandFindOne,
							index: index,
							needs: ["", ""]
						});
					} else if (ch === "F") {
						stack.push({
							cmd: Lang.commandFindTwo,
							index: index,
							needs: ["", ""]
						});
					} else if (ch === "\"") {
						str = "";
					} else if (ch === "'") {
						str = " ";
					} else if (!isNaN(parseInt(ch))) {
						nStr = ch;
					}
					else if (ch === "\n" || ch === "\t" || ch === " ") {
						//do nothing
					} else if (ch === "#") {
						comment = true;
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
						} else if (c === "\"" || c === "\n") {
							cmd(str);
							str = undefined;
						} else if (c === "'") {
							cmd(str + " ");
							str = undefined;
						} else {
							str += c;
						}
					}
				}
			}
			if (str) {
				cmd(str);
			} else if (nStr) {
				cmd(parseInt(nStr));
			}
			return output;
		},
		commandDefault: (args) => {
			return args[0];
		},
		commandUpper: (args) => {
			return args[0].toUpperCase();
		},
		commandLower: (args) => {
			return args[0].toLowerCase();
		},
		commandSubstringOne: (args) => {
			return args[1].substring(args[0]);
		},
		commandSubstringTwo: (args) => {
			return args[1].substring(args[0], args[2]);
		},
		commandFindOne: (args) => {
			return args[0].indexOf(args[1]);
		},
		commandFindTwo: (args) => {
			return args[0].indexOf(args[1]) + args[1].length;
		}
	};
})();
