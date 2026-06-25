import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";

const mockedPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockedPush,
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1 },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

jest.mock("@/service/posts/posts", () => ({
  postsService: {
    getLikedPosts: jest.fn(),
    toggleLikePost: jest.fn(),
  },
}));

import LikedPosts from "./page";
import { postsService } from "@/service/posts/posts";

describe("Testes LikedPosts page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza posts curtidos e permite descurtir, mostrando estado vazio e navegando", async () => {
    (postsService.getLikedPosts as jest.Mock).mockResolvedValue({
      posts: [
        {
          id: 1,
          title: "Título 1",
          body: "Conteúdo 1",
          liked: true,
          reactions: { likes: 5, dislikes: 0 },
        },
      ],
      total: 1,
      limit: 50,
    });

    (postsService.toggleLikePost as jest.Mock).mockResolvedValue(undefined);

    render(<LikedPosts />);

    // espera o post aparecer
    await waitFor(() => expect(screen.getByText("Título 1")).toBeTruthy());

    // botão curtido presente dentro do item de lista
    const listItem = screen.getByRole("listitem");
    const likeButton = within(listItem).getByRole("button", { name: /Curtido/i });
    expect(likeButton).toBeTruthy();

    // clica para descurtir
    fireEvent.click(likeButton);

    // espera o post ser removido da lista
    await waitFor(() => expect(screen.queryByText("Título 1")).toBeNull());

    // verifica estado vazio e botão para ver posts
    expect(
      screen.getByText("Você ainda não curtiu nenhum post.")
    ).toBeTruthy();

    const verPostsButton = screen.getByRole("button", { name: /Ver posts/i });
    fireEvent.click(verPostsButton);

    expect(mockedPush).toHaveBeenCalledWith("/");
    expect(postsService.toggleLikePost).toHaveBeenCalledWith({ postId: 1, userId: 1 });
  });
});
