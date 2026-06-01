import { saveUser, getUser } from "./localStorage";

describe("Testes LocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("deve recuperar usuário salvo", () => {
    const user = {
      id: 1,
      email: "teste@email.com",
    };

    saveUser(user);

    expect(getUser()).toEqual(user);
  });
});