import { render, screen, waitFor, fireEvent } from "@testing-library/react";

const mockedPush = jest.fn();
const mockedLogin = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ login: mockedLogin }),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: { signIn: jest.fn() },
}));

import SignIn from "./page";
import { authService } from "@/service/auth/auth";

describe("SignIn page", () => {
  beforeEach(() => jest.clearAllMocks());

  test("fluxo de login bem-sucedido chama login e navega para /", async () => {
    (authService.signIn as jest.Mock).mockResolvedValue({ id: 1, email: "a@b.com" });

    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText(/seu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButtons = screen.getAllByRole("button", { name: /Entrar/i });
    const submitButton = submitButtons.find((b) => b.getAttribute("type") === "submit")!;

    fireEvent.change(emailInput, { target: { value: "a@b.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(authService.signIn).toHaveBeenCalledWith({ email: "a@b.com", password: "password" }));
    expect(mockedLogin).toHaveBeenCalledWith({ id: 1, email: "a@b.com" });
    expect(mockedPush).toHaveBeenCalledWith("/");
  });

  test("validação de formulário: mostra erros quando campos estão vazios", async () => {
    render(<SignIn />);

    const submitButtons = screen.getAllByRole("button", { name: /Entrar/i });
    const submitButton = submitButtons.find((b) => b.getAttribute("type") === "submit")!;
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email é obrigatório/i)).toBeTruthy();
      expect(screen.getByText(/Senha é obrigatória/i)).toBeTruthy();
    });
  });
});
