(function() {
	"use strict";

	const code = document.querySelector("#code");
	const input = document.querySelector("#input");
	const output = document.querySelector("#output");
	const button = document.querySelector("#submit");

	button.addEventListener("click", () => {
		output.innerText = Lang.run(code.value, input.value);
	});
})();
