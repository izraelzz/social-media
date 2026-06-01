import { isPasswordValid } from "./password";

describe("Validação senha", () => {
  test("deve aceitar senha forte", () => {
    expect(isPasswordValid("FakePassword@123")).toBe(true);
  });
});