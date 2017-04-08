var Lang;

(function() {
	"use strict";


	let substringFirst;
	let substringSecond;

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

			substringFirst = undefined;
			substringSecond = undefined;

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
				if (debug && func.debug !== false) {
					debug(output, func.index - 1, func.lastIndex || func.index);
				}
				if (stack.length) {
					oldCmd(buffer);
				} else {
					if (buffer !== undefined) {
						output += buffer;
					}
					if (func.after) {
						func.after();
					}
				}
				return output;
			};
			for (let ch of code) {
				if (nStr) {
					if (!isNaN(parseInt(ch))) {
						nStr += ch;
					} else {
						let n = parseInt(nStr);
						oldCmd(n);
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
					} else if (ch === "s") {
						stack.push({
							cmd: Lang.commandSubstringOne,
							index: index,
							after: () => {
								stack.push({
									cmd: Lang.commandSubstringOne,
									debug: false
								});
							}
						});
					} else if (ch === "S") {
						stack.push({
							cmd: Lang.commandSubstringTwo,
							index: index,
							after: () => {
								stack.push({
									cmd: Lang.commandSubstringTwo,
									debug: false,
									after: () => {
										stack.push({
											cmd: Lang.commandSubstringTwo,
											debug: false
										});
									}
								});
							}
						});
					} else if (ch === "i") {
						cmd(input);
					} else if (ch === "q") {
						cmd(code);
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
		},
		commandSubstringOne: (buffer) => {
			if (substringFirst !== undefined) {
				let str = buffer.substring(substringFirst);
				substringFirst = undefined;
				return str;
			} else {
				substringFirst = buffer;
			}
		},
		commandSubstringTwo: (buffer) => {
			if (substringFirst !== undefined) {
				if (substringSecond !== undefined) {
					let str = buffer.substring(substringFirst, substringSecond);
					substringFirst = undefined;
					substringSecond = undefined;
					return str;
				} else {
					substringSecond = buffer;
				}
			} else {
				substringFirst = buffer;
			}
		}
	};
})();
