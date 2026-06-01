import { render, screen, waitFor } from "@testing-library/react";
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("AuthProvider e Header", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("deve exibir botão sair quando existir usuário logado", async () => {
    localStorage.setItem(
      "sqa_social_user",
      JSON.stringify({
        id: 1,
        email: "teste@email.com",
      })
    );

    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Sair")).toBeTruthy();
    });
  });
});