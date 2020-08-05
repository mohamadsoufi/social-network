import React from "react";
import { render, waitForElement, fireEvent } from "@testing-library/react";
import axios from "./axios";
import { BioEditor } from "./BioEditor";

jest.mock("./axios");

// When no bio is passed to it, an "Add" button is rendered.

// When a bio is passed to it, an "Edit" button is rendered.

// Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered.

// Clicking the "Save" button causes an ajax request. The request should not actually happen during your test. To prevent it from actually happening, you should mock axios.

// When the mock request is successful, the function that was passed as a prop to the component gets called.

test("no bio is passed to it, an 'Add' button is rendered.", () => {
    const { container } = render(<BioEditor />);
    expect(container.innerHTML).toContain("Add Bio");
});

test("no bio is passed to it, an 'Edit' button is rendered.", () => {
    axios.post
        .mockResolvedValue("/update-bio", { text: "yess" })
        .then((data) => {
            data: {
                bio: "yess";
            }
        });

    const { container } = render(<BioEditor />);

    expect(container.querySelector("button").innerHTML).toContain("Edit Bio");
});
