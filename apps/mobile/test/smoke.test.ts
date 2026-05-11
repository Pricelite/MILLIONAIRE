import assert from "node:assert/strict";
import test from "node:test";

import { getMobileApiUrl } from "../src/env";

test("getMobileApiUrl returns explicit env value", () => {
  assert.equal(getMobileApiUrl({ EXPO_PUBLIC_API_URL: "http://api.example.test" }), "http://api.example.test");
});

test("getMobileApiUrl falls back to localhost", () => {
  assert.equal(getMobileApiUrl({}), "http://localhost:4000");
});
