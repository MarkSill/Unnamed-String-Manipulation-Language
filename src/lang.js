var Lang;

(function() {
	"use strict";

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
			let cmd = (buffer) => {
				stack.push({
					cmd: Lang.commandDefault,
					index: index
				});
				oldCmd(buffer);
			};
			let oldCmd = (buffer) => {
				let func = stack.pop();
				buffer = func.cmd(buffer, input);
				if (debug) {
					debug(output + buffer, func.index - 1, func.lastIndex || func.index);
				}
				if (stack.length) {
					oldCmd(buffer);
				} else {
					output += buffer;
				}
				return output;
			};
			for (let ch of code) {
				if (nStr) {
					if (!isNaN(parseInt(ch))) {
						nStr += ch;
					} else {
						let n = parseInt(nStr);
						if (debug) {
							debug(output, index - nStr.length - 1, index);
						}
						nStr = undefined;
					}
				}
				if (typeof str !== "string" && !nStr) {
					if (ch === "h") {
						cmd("Hello, world!");
					} else if (ch === "u") {
						stack.push({
							cmd: Lang.commandUpper,
							index: index
						});
					} else if (ch === "l") {
						stack.push({
							cmd: Lang.commandLower,
							index: index
						});
					} else if (ch === "\"") {
						str = "";
					} else if (ch === "'") {
						str = " ";
					}
					else if (!isNaN(parseInt(ch))) {
						nStr = ch;
					}
					else if (ch === "\n" || ch === "\t" || ch === " ") {
						//do nothing
					} else {
						output = `Error: Invalid command "${ch}" at character ${index}.`;
						break;
					}
					if (debug && typeof str !== "string" && !nStr) {
						//debug(output, index - 1, index);
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
							stack.push({
								cmd: Lang.commandDefault,
								index: index - str.length - 1,
								lastIndex: index
							});
							oldCmd(str);
							str = undefined;
						} else if (c === "'") {
							stack.push({
								cmd: Lang.commandDefault,
								index: index - str.length - 1,
								lastIndex: index
							});
							oldCmd(`${str} `);
							str = undefined;
						} else {
							str += c;
						}
					}
				}
				index++;
			}
			if (str) {
				stack.push({
					cmd: Lang.commandDefault,
					index: index - str.length - 1,
					lastIndex: index
				});
				oldCmd(str);
			} else if (nStr) {
				cmd(parseInt(nStr));
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
