(function() {
	"use strict";

	const code = document.querySelector("#code");
	const input = document.querySelector("#input");
	const output = document.querySelector("#output");
	const button = document.querySelector("#submit");
	const step = document.querySelector("#step");
	const stepFirst = document.querySelector("#code-step-first");
	const stepMiddle = document.querySelector("#code-step-middle");
	const stepLast = document.querySelector("#code-step-last");
	const stepUnder = document.querySelector("#code-step-under");

	let steps;
	let stepIndex;
	let stepResult;

	code.addEventListener("input", () => {
		steps = undefined;
		stepFirst.innerText = "";
		stepMiddle.innerText = "";
		stepLast.innerHTML = "&nbsp;";
		stepUnder.innerHTML = "&nbsp;";
	});

	button.addEventListener("click", () => {
		output.innerText = Lang.run(code.value, input.value);
	});

	step.addEventListener("click", () => {
		if (!steps) {
			steps = [];
			stepIndex = 0;
			stepResult = Lang.run(code.value, input.value, (currentOutput, index, endIndex) => {
				steps.push({
					output: currentOutput,
					index: index,
					endIndex: endIndex
				});
			});
		}
		let s = steps[stepIndex++];
		if (s) {
			stepFirst.innerText = code.value.substring(0, s.index);
			stepMiddle.innerText = code.value.substring(s.index, s.endIndex);
			stepLast.innerText = code.value.substring(s.endIndex);
			let str = "";
			for (let i = 0; i < s.index; i++) {
				str += "&nbsp;";
			}
			let size = s.endIndex - s.index - 1;
			if (size === 0) {
				size = 1;
			}
			for (let i = 0; i < size; i++) {
				str += "^";
			}
			stepUnder.innerHTML = str;
			output.innerText = s.output;
		} else {
			stepFirst.innerText = code.value;
			stepMiddle.innerText = "";
			stepLast.innerHTML = "&nbsp;";
			stepUnder.innerHTML = "&nbsp;";
			steps = undefined;
			output.innerText = stepResult;
		}
	});
})();
