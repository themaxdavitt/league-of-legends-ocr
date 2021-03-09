#include <napi.h>
#include <leptonica/allheaders.h>
#include <tesseract/baseapi.h>

using namespace Napi;
using namespace tesseract;

Value GetArgObject(const CallbackInfo& info, const Env& env) {
	if (info.Length() != 1) {
		TypeError::New(env, "Wrong number of arguments")
			.ThrowAsJavaScriptException();
		return env.Null();
	}

	if (!info[0].IsObject()) {
		TypeError::New(env, "Argument must be an object")
			.ThrowAsJavaScriptException();
		return env.Null();
	}

	return info[0];
}

Value GetTessData(const Env& env, const Object& args) {
	auto tess_data = args.Get("tessData");

	if (!tess_data.IsBuffer()) {
		TypeError::New(env, "\"tessData\" property must be a Buffer")
			.ThrowAsJavaScriptException();
		return env.Null();
	}

	return tess_data;
}

Value GetImgData(const Env& env, const Object& args) {
	auto img_data = args.Get("imgData");

	if (!img_data.IsBuffer()) {
		TypeError::New(env, "\"imgData\" property must be a Buffer")
			.ThrowAsJavaScriptException();
		return env.Null();
	}

	return img_data;
}

Value GetGoldValueStatus(const Env& env, const Object& args) {
	auto value = args.Get("goldValues");

	if (value.IsUndefined()) {
		return Boolean::New(env, true);
	} else if (value.IsBoolean()) {
		return value;
	} else {
		TypeError::New(env, "\"goldValues\" property must be a Boolean")
			.ThrowAsJavaScriptException();
		return env.Null();
	}
}

Value GetTimeValueStatus(const Env& env, const Object& args) {
	auto value = args.Get("timeValue");

	if (value.IsUndefined()) {
		return Boolean::New(env, true);
	} else if (value.IsBoolean()) {
		return value;
	} else {
		TypeError::New(env, "\"timeValue\" property must be a Boolean")
			.ThrowAsJavaScriptException();
		return env.Null();
	}
}

Value GetTowerValueStatus(const Env& env, const Object& args) {
	auto value = args.Get("towerValues");

	if (value.IsUndefined()) {
		return Boolean::New(env, true);
	} else if (value.IsBoolean()) {
		return value;
	} else {
		TypeError::New(env, "\"towerValues\" property must be a Boolean")
			.ThrowAsJavaScriptException();
		return env.Null();
	}
}

Value GetKillValueStatus(const Env& env, const Object& args) {
	auto value = args.Get("killValues");

	if (value.IsUndefined()) {
		return Boolean::New(env, true);
	} else if (value.IsBoolean()) {
		return value;
	} else {
		TypeError::New(env, "\"killValues\" property must be a Boolean")
			.ThrowAsJavaScriptException();
		return env.Null();
	}
}

Value Recognize(const CallbackInfo& info) {
	auto env = info.Env();
	auto obj = Object::New(env);

	auto args = GetArgObject(info, env).As<Object>();
	auto tess_data = GetTessData(env, args).As<Buffer<char>>();
	auto img_data = GetImgData(env, args).As<Buffer<l_uint8>>();

	auto tess = new TessBaseAPI();
	auto img = pixReadMem(img_data.Data(), img_data.Length());
	pixSetResolution(img, 1920, 1080);
	auto box_clipping = boxCreate(0, 0, 1920, 93);
	auto img_clipped = pixClipRectangle(img, box_clipping, nullptr);
	auto img_grayscale = pixConvertRGBToGrayMinMax(img_clipped, L_CHOOSE_MAX);
	auto img_inverted = pixInvert(nullptr, img_grayscale);
	auto img_binarized = pixThresholdToBinary(img_inverted, 150);
	//pixWrite("test.png", img_binarized, IFF_PNG);

	tess->Init(tess_data.Data(), tess_data.Length(), "eng", OEM_DEFAULT, nullptr, 0, nullptr, nullptr, false, nullptr);
	tess->SetImage(img_binarized);

	if (GetGoldValueStatus(env, args).As<Boolean>().Value()) {
		tess->SetRectangle(759, 16, 96, 24);
		const char* blue_gold = tess->GetUTF8Text();
		obj.Set("blueGold", String::New(env, blue_gold));
		delete[] blue_gold;

		tess->SetRectangle(1141, 16, 96, 24);
		const char* red_gold = tess->GetUTF8Text();
		obj.Set("redGold", String::New(env, red_gold));
		delete[] red_gold;
	}

	if (GetTimeValueStatus(env, args).As<Boolean>().Value()) {
		tess->SetRectangle(933, 78, 64, 15);
		const char* time = tess->GetUTF8Text();
		obj.Set("time", String::New(env, time));
		delete[] time;
	}

	if (GetTowerValueStatus(env, args).As<Boolean>().Value()) {
		tess->SetRectangle(669, 16, 58, 24);
		const char* blue_towers = tess->GetUTF8Text();
		obj.Set("blueTowers", String::New(env, blue_towers));
		delete[] blue_towers;

		tess->SetRectangle(1261, 16, 58, 24);
		const char* red_towers = tess->GetUTF8Text();
		obj.Set("redTowers", String::New(env, red_towers));
		delete[] red_towers;
	}

	if (GetKillValueStatus(env, args).As<Boolean>().Value()) {
		tess->SetRectangle(904, 8, 48, 54);
		const char* blue_kills = tess->GetUTF8Text();
		obj.Set("blueKills", String::New(env, blue_kills));
		delete[] blue_kills;

		tess->SetRectangle(980, 8, 48, 54);
		const char* red_kills = tess->GetUTF8Text();
		obj.Set("redKills", String::New(env, red_kills));
		delete[] red_kills;
	}

	tess->End();
	delete tess;

	pixDestroy(&img);
	boxDestroy(&box_clipping);
	pixDestroy(&img_clipped);
	pixDestroy(&img_grayscale);
	pixDestroy(&img_inverted);
	pixDestroy(&img_binarized);

	return obj;
}

Object Init(Env env, Object exports) {
	exports["recognize"] = Function::New(env, Recognize);
	return exports;
}

NODE_API_MODULE(addon, Init)
