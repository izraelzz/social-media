import { render, screen } from "@testing-library/react";
import PostCard from "./PostCard";

describe("Testes PostCard", () => {
  test("deve renderizar título e conteúdo", () => {
    render(
      <PostCard
        post={{
          id: 1,
          title: "Título",
          body: "Conteúdo",
          liked: false,
        }}
        isAuthenticated={true}
        onLike={jest.fn()}
      />
    );

    expect(screen.getByText("Título")).toBeTruthy();
    expect(screen.getByText("Conteúdo")).toBeTruthy();
  });
});