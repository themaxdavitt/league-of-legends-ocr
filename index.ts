const addon = require("bindings")("addon");

// Yeah I went a bit overboard with types here.

export type LolOcrRequiredProps = {
	/**
	 * [Training data](https://github.com/tesseract-ocr/tessdata) to pass to [Tesseract](https://tesseract-ocr.github.io/tessdoc/), the underlying OCR engine.
	 *
	 * Consider downloading `eng.traineddata` from the training data repository (linked above) and reading it like so:
	 * ```typescript
	 * import { readFile } from 'fs/promises';
	 *
	 * const tessData = await readFile('./eng.traineddata');
	 * ```
	 */
	tessData: Buffer;
	/**
	 * Image data to pass to [Leptonica](http://www.leptonica.org/), a library that [Tesseract](https://tesseract-ocr.github.io/tessdoc/), the underlying OCR engine, uses to process image files.
	 *
	 * See Leptonica's supported image formats [here](https://tpgit.github.io/UnOfficialLeptDocs/leptonica/README.html?highlight=format#image-i-o).
	 *
	 * We assume this is a 1920 by 1080 spectator mode gameplay screenshot when passing it to Tesseract. Other image sizes are currently unsupported. Open an issue in our GitHub repository if you'd like support added for your preferred resolution.
	 */
	imgData: Buffer;
};

export type LolOcrGoldValues = {
	/**
	 * Blue team's gold as read from `imgData` e.g. `"1.2k"`.
	 *
	 * This sometimes mistakes `","` for `"."`, you should correct for that. It might also mix up `"0"` for `"O"`, not really sure, haven't noticed it much though.
	 *
	 * Consider parsing it like so:
	 * ```typescript
	 * const ocrBlueGold = /([\d\.]+)/.exec(values.blueGold.replace(/,/g, '.'));
	 * ```
	 */
	blueGold: string;
	/**
	 * Red team's gold as read from `imgData` e.g. `"1.2k"`.
	 *
	 * This sometimes mistakes `","` for `"."`, you should correct for that. It might also mix up `"0"` for `"O"`, not really sure, haven't noticed it much though.
	 *
	 * Consider parsing it like so:
	 * ```typescript
	 * const ocrRedGold = /([\d\.]+)/.exec(values.redGold.replace(/,/g, '.'));
	 * ```
	 */
	redGold: string;
};

export type LolOcrTimeValue = {
	/**
	 * Time as read from `imgData` e.g. `"01:23"`.
	 *
	 * This sometimes mistakes `"0"` for `"O"`, you should correct for that.
	 *
	 * In general this value is particularly suspect to breaking, so you should also check it against what you receive from the [Live Client Data API](https://developer.riotgames.com/docs/lol#game-client-api_live-client-data-api).
	 *
	 * Consider parsing it like so:
	 * ```typescript
	 * const ocrTime = /(\d{2}):(\d{2})/g.exec(values.time);
	 * ```
	 */
	time: string;
};

export type LolOcrTowerValues = {
	/**
	 * Blue team's towers taken as read from `imgData` e.g. `"1"`.
	 *
	 * This sometimes mistakes `"0"` for `"O"`, you should correct for that.
	 *
	 * Consider parsing it like so:
	 * ```typescript
	 * const ocrBlueTowers = /([\d]+)/.exec(values.blueTowers.replace(/o/g, '0'));
	 * ```
	 */
	blueTowers: string;
	/**
	 * Red team's towers taken as read from `imgData` e.g. `"1"`.
	 *
	 * This sometimes mistakes `"0"` for `"O"`, you should correct for that.
	 *
	 * Consider parsing it like so:
	 * ```typescript
	 * const ocrRedTowers = /([\d]+)/.exec(values.redTowers.replace(/o/g, '0'));
	 * ```
	 */
	redTowers: string;
};

export type LolOcrKillValues = {
	/**
	 * Blue team's kills as read from `imgData` e.g. `"1"`.
	 *
	 * This sometimes mistakes `"0"` for `"O"`, you should correct for that.
	 *
	 * Consider parsing it like so:
	 * ```typescript
	 * const ocrBlueKills = /([\d]+)/.exec(values.blueKills.replace(/o/g, '0'));
	 * ```
	 */
	blueKills: string;
	/**
	 * Red team's kills as read from `imgData` e.g. `"1"`.
	 *
	 * This sometimes mistakes `"0"` for `"O"`, you should correct for that.
	 *
	 * Consider parsing it like so:
	 * ```typescript
	 * const ocrRedKills = /([\d]+)/.exec(values.redKills.replace(/o/g, '0'));
	 * ```
	 */
	redKills: string;
};

type LolOcrGoldProp<T> = {
	/**
	 * Whether or not to read team gold
	 */
	goldValues: T;
};

type LolOcrTimeProp<T> = {
	/**
	 * Whether or not to read the time
	 */
	timeValue: T;
};

type LolOcrTowerProp<T> = {
	/**
	 * Whether or not to read team towers
	 */
	towerValues: T;
};

type LolOcrKillProp<T> = {
	/**
	 * Whether or not to read team kills
	 */
	killValues: T;
};

/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<true> &
		LolOcrTimeProp<false> &
		LolOcrTowerProp<false> &
		LolOcrKillProp<false>
): LolOcrGoldValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<true> &
		LolOcrTimeProp<true> &
		LolOcrTowerProp<false> &
		LolOcrKillProp<false>
): LolOcrGoldValues & LolOcrTimeValue;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<true> &
		LolOcrTimeProp<true> &
		LolOcrTowerProp<true> &
		LolOcrKillProp<false>
): LolOcrGoldValues & LolOcrTimeValue & LolOcrTowerValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<false> &
		LolOcrTimeProp<true> &
		LolOcrTowerProp<false> &
		LolOcrKillProp<false>
): LolOcrTimeValue;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<false> &
		LolOcrTimeProp<true> &
		LolOcrTowerProp<true> &
		LolOcrKillProp<false>
): LolOcrTimeValue & LolOcrTowerValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<false> &
		LolOcrTimeProp<false> &
		LolOcrTowerProp<true> &
		LolOcrKillProp<false>
): LolOcrTowerValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<false> &
		LolOcrTimeProp<false> &
		LolOcrTowerProp<false> &
		LolOcrKillProp<false>
): {};
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<true> &
		LolOcrTimeProp<false> &
		LolOcrTowerProp<true> &
		LolOcrKillProp<false>
): LolOcrGoldValues & LolOcrTowerValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<true> &
		LolOcrTimeProp<false> &
		LolOcrTowerProp<false> &
		LolOcrKillProp<true>
): LolOcrGoldValues & LolOcrKillValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<true> &
		LolOcrTimeProp<true> &
		LolOcrTowerProp<false> &
		LolOcrKillProp<true>
): LolOcrGoldValues & LolOcrTimeValue & LolOcrKillValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<true> &
		LolOcrTimeProp<true> &
		LolOcrTowerProp<true> &
		LolOcrKillProp<true>
): LolOcrGoldValues & LolOcrTimeValue & LolOcrTowerValues & LolOcrKillValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<false> &
		LolOcrTimeProp<true> &
		LolOcrTowerProp<false> &
		LolOcrKillProp<true>
): LolOcrTimeValue & LolOcrKillValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<false> &
		LolOcrTimeProp<true> &
		LolOcrTowerProp<true> &
		LolOcrKillProp<true>
): LolOcrTimeValue & LolOcrTowerValues & LolOcrKillValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<false> &
		LolOcrTimeProp<false> &
		LolOcrTowerProp<true> &
		LolOcrKillProp<true>
): LolOcrTowerValues & LolOcrKillValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<false> &
		LolOcrTimeProp<false> &
		LolOcrTowerProp<false> &
		LolOcrKillProp<true>
): LolOcrKillValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ``` */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<true> &
		LolOcrTimeProp<false> &
		LolOcrTowerProp<true> &
		LolOcrKillProp<true>
): LolOcrGoldValues & LolOcrTowerValues & LolOcrKillValues;
/**
 * Recognize certain values from the `imgData` passed in, using Tesseract with `tessData` as training data.
 *
 * If you're experiencing type errors, ensure the object passed in looks similar to this:
 * ```typescript
 * type LolOcrProps = {
 *		 tessData: Buffer,
 *		 imgData: Buffer,
 *		 goldValues: boolean,
 *		 timeValue: boolean,
 *		 towerValues: boolean,
 *		 killValues: boolean
 * };
 * ```
 */
export function recognize(
	args: LolOcrRequiredProps &
		LolOcrGoldProp<boolean> &
		LolOcrTimeProp<boolean> &
		LolOcrTowerProp<boolean> &
		LolOcrKillProp<boolean>
): Partial<
	LolOcrGoldValues & LolOcrTimeValue & LolOcrTowerValues & LolOcrKillValues
> {
	return addon.recognize(args);
}
