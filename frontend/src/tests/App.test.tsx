import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../app/page";

describe("<App />", () => {
  it("should render hey ", () => {
    render(<App />);
    expect(screen.getByRole("main")).toHaveTextContent(/hey/i);
  });
});
