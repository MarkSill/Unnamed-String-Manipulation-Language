(function() {
	"use strict";

	const code = document.querySelector("#code");
	const input = document.querySelector("#input");
	const output = document.querySelector("#output");
	const button = document.querySelector("#submit");
	const step = document.querySelector("#step");
	const getLink = document.querySelector("#get-link");
	const getLinkResult = document.querySelector("#get-link-result");
	const stepFirst = document.querySelector("#code-step-first");
	const stepMiddle = document.querySelector("#code-step-middle");
	const stepLast = document.querySelector("#code-step-last");

	let steps;
	let stepIndex;
	let stepResult;

	code.addEventListener("input", () => {
		steps = undefined;
		stepFirst.innerText = "";
		stepMiddle.innerText = "";
		stepLast.innerHTML = "&nbsp;";
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
			stepFirst.innerText = code.value.substring(0, s.index).replace(/\n/g, "");
			stepMiddle.innerText = code.value.substring(s.index, s.endIndex).replace(/\n/g, "");
			stepLast.innerText = code.value.substring(s.endIndex).replace(/\n/g, "");
			output.innerText = s.output;
		} else {
			stepFirst.innerText = code.value.replace(/\n/g, "");
			stepMiddle.innerText = "";
			stepLast.innerHTML = "&nbsp;";
			steps = undefined;
			output.innerText = stepResult;
		}
	});

	getLink.addEventListener("click", () => {
		let url = `https://marksill.github.io/Unnamed-String-Manipulation-Language/?code=${encodeURIComponent(code.value)}`;
		if (input.value) {
			url += `&input=${encodeURIComponent(input.value)}`;
		}
		getLinkResult.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
	});

	let url = new URL(location.href);
	let params = new URLSearchParams(url.search);
	if (params.get("code")) {
		code.value = params.get("code");
	}
	if (params.get("input")) {
		input.value = params.get("input");
	}
})();
