import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../app/page.js";

describe("Home", () => {
  it("renders the hello world heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Hello, World!" }).textContent,
    ).toBe("Hello, World!");
  });
});
