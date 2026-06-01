import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}));

describe("Integração Auth e Header", () => {
  test("deve mostrar botão sair quando autenticado", () => {
    render(<Header />);

    expect(screen.getByText("Sair")).toBeTruthy();
  });
});