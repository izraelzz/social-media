import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { saveUser } from "@/lib/localStorage";

function Usuario() {
  const { isAuthenticated } = useAuth();

  return <>{isAuthenticated ? "true" : "false"}</>;
}

describe("AuthProvider e localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("deve carregar usuário salvo no localStorage", async () => {
    const user = {
      id: 1,
      email: "teste@gmail.com",
    };

    saveUser(user);

    render(
      <AuthProvider>
        <Usuario />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("true")).toBeTruthy(); // não consegue achar "true", logo os dados não persistem no F5
    });
  });
});