import assert from "node:assert/strict";
import test from "node:test";

import { AppRole } from "../src/common/enums/role.enum";

test("AppRole exposes expected roles", () => {
  const roles = Object.values(AppRole);

  assert.equal(roles.length, 6);
  assert.ok(roles.includes("SUPER_ADMIN"));
  assert.ok(roles.includes("CUSTOMER"));
});
