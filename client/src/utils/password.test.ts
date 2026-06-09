import { isPasswordValid } from "./password";

describe("Validação senha", () => {
  test("deve aceitar senha forte", () => {
    expect(isPasswordValid("FakePassword@123")).toBe(true);
  });

  test("deve aceitar senha com exatamente 8 caracteres quando atende aos critérios", () => {
    // 8 caracteres: A a 1 @ a b c d
    expect(isPasswordValid("Aa1@abcd")).toBe(true);
  });

  test("não deve aceitar senha com 7 caracteres mesmo que contenha outros critérios", () => {
    expect(isPasswordValid("Aa1@abc")).toBe(false);
  });
});