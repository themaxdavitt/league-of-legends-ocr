import { readFile } from "fs/promises";

import { recognize } from "./index";

(async () =>
	console.log(
		recognize({
			tessData: await readFile("./eng.traineddata"),
			imgData: await readFile("./screenshot.png"),
			goldValues: true,
			timeValue: true,
			towerValues: true,
			killValues: true,
		})
	))();
