import { describe, it, expect } from "vitest";
import { JarTile, jarTileTag, selectors } from "./JarTile";
import { defineCustomElt } from "../componentUtils";
import { SideLabel, sideLabelTag } from "../SideLabel/SideLabel";
import { JarIllustration } from "../JarIllustration/JarIllustration";
import { reactionPickerEvents } from "../ReactionPicker/ReactionPicker";
import { rangeEvents } from "../VerticalRange/VerticalRange";
import { queryTestElement, renderComponent } from "../../test/testUtils";
import userEvent from "@testing-library/user-event";
import { TopicHolder } from "../../models/TopicHolder";
import { emotionalReactions } from "../../api";

defineCustomElt(sideLabelTag, SideLabel);
defineCustomElt(jarTileTag, JarTile);

const renderJarTile = () => renderComponent<JarTile>(jarTileTag);

const exampleContainer = new TopicHolder();

const getJarIllustration = (component: JarTile) => {
  return queryTestElement<JarIllustration>(
    component,
    selectors.jarIllustration,
  );
};

function getSideLabel(component: JarTile, sideLabelN: number) {
  return queryTestElement<SideLabel>(
    component,
    selectors.labels.at(sideLabelN)!,
  );
}

describe("<jar-tile>", () => {
  describe("initial rendering", () => {
    it("renders with default values", () => {
      const component = renderJarTile();
      const jarIllustration = getJarIllustration(component);

      component.setProps({ topic: exampleContainer });

      const exportedProps = component.export();

      expect(exportedProps).toEqual(exampleContainer);
      expect(jarIllustration).toBeTruthy();
    });

    it("propagates initial fill values to jar illustration", () => {
      const component = renderJarTile();
      component.setProps({ topic: exampleContainer });

      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );

      expect(jarIllustration.strengthleft).toBe(
        exampleContainer.emotions[0].strength,
      );
      expect(jarIllustration.strengthright).toBe(
        exampleContainer.emotions[1].strength,
      );
    });

    it("propagates initial reaction values to jar illustration", () => {
      const component = renderJarTile();
      const topicProp = new TopicHolder();
      topicProp.emotions[0].reaction = emotionalReactions.positive;
      topicProp.emotions[1].reaction = emotionalReactions.negative;
      component.setProps({ topic: topicProp });

      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );

      expect(jarIllustration.reactionleft).toBe(emotionalReactions.positive);
      expect(jarIllustration.reactionright).toBe(emotionalReactions.negative);
    });

    it("propagates initial label values to side labels", () => {
      const component = renderJarTile();
      component.setProps({ topic: exampleContainer });

      selectors.labels.forEach((selector, i) => {
        const labelElt = queryTestElement<SideLabel>(component, selector);
        expect(labelElt.label).toBe(exampleContainer.emotions[i].producer);
      });
    });

    it("renders label textarea", () => {
      const component = renderJarTile();
      const labelInput = queryTestElement<HTMLTextAreaElement>(
        component,
        selectors.labelInput,
      );

      expect(labelInput.tagName).toBe("TEXTAREA");
      expect(labelInput.value).toBe("");
    });

    it("renders remove button", () => {
      const component = renderJarTile();
      const removeBtn = queryTestElement(component, selectors.removeBtn);

      expect(removeBtn.textContent).toBe("×");
    });
  });

  describe("reactionchange event updates illustration and export", () => {
    it("updates reactionleft when left reaction controls emit reactionchange", () => {
      const component = renderJarTile();
      const reactionLeft = queryTestElement(component, selectors.reactions[0]);
      const newReaction = emotionalReactions.negative;
      const event = new CustomEvent(reactionPickerEvents.reactionchange, {
        detail: { reaction: newReaction },
      });
      reactionLeft.dispatchEvent(event);

      const jarIllustration = getJarIllustration(component);
      const sideLabel = getSideLabel(component, 0);

      expect(jarIllustration.reactionleft).toBe(newReaction);
      expect(component.export().emotions[0].reaction, newReaction);
      expect(sideLabel.reaction).toBe(newReaction);
    });

    it("updates reactionright when right reaction controls emit reactionchange", () => {
      const component = renderJarTile();
      const reactionRight = queryTestElement(component, selectors.reactions[1]);
      const newReaction = emotionalReactions.positive;
      const event = new CustomEvent(reactionPickerEvents.reactionchange, {
        detail: { reaction: newReaction },
      });
      reactionRight.dispatchEvent(event);

      const jarIllustration = getJarIllustration(component);
      const sideLabel = getSideLabel(component, 1);

      expect(jarIllustration.reactionright).toBe(newReaction);
      expect(component.export().emotions[1].reaction, newReaction);
      expect(sideLabel.reaction).toBe(newReaction);
    });

    it("empty reaction keeps previous reaction", () => {
      const component = renderJarTile();
      component.setProps({ topic: exampleContainer });
      const reactionLeft = queryTestElement(component, selectors.reactions[0]);

      const event = new CustomEvent(reactionPickerEvents.reactionchange, {});
      reactionLeft.dispatchEvent(event);

      expect(component.export()).toEqual(exampleContainer);
    });
  });

  describe("rangechange event updates illustration and export", () => {
    it("updates fillleft when left range emits rangechange", () => {
      const component = renderJarTile();
      const rangeLeft = queryTestElement(component, selectors.ranges[0]);

      const event = new CustomEvent(rangeEvents.rangechange, {
        detail: { value: 45 },
      });
      rangeLeft.dispatchEvent(event);

      expect(component.export().emotions[0].strength).toBe("45");
    });

    it("handles rangechange with zero value", () => {
      const component = renderJarTile();
      component.setProps({ topic: exampleContainer });
      const rangeLeft = queryTestElement(component, selectors.ranges[1]);

      const event = new CustomEvent(rangeEvents.rangechange, {});
      rangeLeft.dispatchEvent(event);

      expect(component.export()).toEqual(exampleContainer);
    });
  });

  describe("updating container label", () => {
    it("exports the correct label", async () => {
      const updatedLabel = "horses r us";
      const user = userEvent.setup();
      const component = renderJarTile();
      const labelInput = queryTestElement(component, selectors.labelInput);

      await user.type(labelInput, updatedLabel);

      expect(component.export().name).toBe(updatedLabel);
    });
  });

  describe("remove functionality", () => {
    it("removes component when remove button is clicked", () => {
      const component = renderJarTile();
      const removeBtn = queryTestElement<HTMLButtonElement>(
        component,
        selectors.removeBtn,
      );

      expect(document.body.contains(component)).toBe(true);

      removeBtn.click();

      expect(document.body.contains(component)).toBe(false);
    });
  });
});
