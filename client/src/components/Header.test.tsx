import { render, screen } from "@testing-library/react";
import Header from "./Header";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    logout: jest.fn(),
  }),
}));

describe("Testes Header", () => {
  test("deve renderizar o título", () => {
    render(<Header />);

    expect(
      screen.getByText("SQA Social Media")
    ).toBeTruthy();
  });
});