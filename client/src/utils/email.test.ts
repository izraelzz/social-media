import { isEmailValid } from "./email";

describe("Validação email", () => {
  test("deve aceitar email válido", () => {
    expect(isEmailValid("teste@gmail.com")).toBe(true);
  });
});