import { describe, it, expect } from "vitest";
import {
  ReactionPicker,
  reactionPickerTag,
  selectors,
  reactionPickerEvents,
  ReactionChangeEvent,
  ReactionPickerProps,
} from "./ReactionPicker";
import { defineCustomElt } from "../componentUtils";
import { renderComponent } from "../../test/testUtils";
import { emotionalReactions } from "../../api";
import userEvent from "@testing-library/user-event";

defineCustomElt(reactionPickerTag, ReactionPicker);

const renderReactionPicker = (attrs: Partial<ReactionPickerProps> = {}) =>
  renderComponent<ReactionPicker>(reactionPickerTag, attrs);

const getSplotches = (component: ReactionPicker) => {
  const splotches = component.shadowRoot?.querySelectorAll<HTMLInputElement>(
    selectors.reactionOptions,
  );
  expect(splotches).toBeTruthy();
  return splotches!;
};

describe(reactionPickerTag, () => {
  describe("initial rendering", () => {
    it("sets background colors of splotches to their values", () => {
      const component = renderReactionPicker();
      const splotches = getSplotches(component);

      splotches.forEach((splotch) => {
        // getting backgroundcolor gets rbg. I'm just checking if it's set since I don't want to convert rgb to hex solely to test
        expect(splotch.style.backgroundColor).not.toBe("");
      });
    });

    it("sets initialReaction to the passed-in prop", () => {
      const initialReaction = emotionalReactions.positive;
      const component = renderReactionPicker({
        initialreaction: initialReaction,
      });

      const selectedReaction =
        component.shadowRoot?.querySelector<HTMLInputElement>(
          'input[name="reaction"]:checked',
        )?.value;

      expect(selectedReaction).toBe(initialReaction);
    });
  });

  describe("click", () => {
    const user = userEvent.setup();

    it("updates the selected reaction", async () => {
      const component = renderReactionPicker();
      const splotches = getSplotches(component);

      const thirdSplotch = splotches[2];
      await user.click(thirdSplotch);

      const selectedReaction =
        component.shadowRoot?.querySelector<HTMLInputElement>(
          'input[name="reaction"]:checked',
        )?.value;

      expect(selectedReaction).toBe(thirdSplotch.value);
    });

    it("emits colorchange event with color=option.value", () => {
      const component = renderReactionPicker();
      const splotches = getSplotches(component);

      const firstSplotch = splotches[0];
      const expectedColor = firstSplotch.value;

      let emittedColor = "";
      component.addEventListener(
        reactionPickerEvents.reactionchange,
        (e: Event) => {
          emittedColor = (e as CustomEvent<ReactionChangeEvent>).detail
            .reaction;
        },
      );

      firstSplotch.click();

      expect(emittedColor).toBe(expectedColor);
    });
  });
});
