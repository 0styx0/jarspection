import templateHtml from "./JarTile.html?raw";
import {
  defineCustomElt,
  handleCustomEvent,
  queryElt,
} from "../componentUtils";
import { SideLabel } from "../SideLabel/SideLabel";
import { JarIllustration } from "../JarIllustration/JarIllustration";
import {
  ReactionChangeEvent,
  ReactionPicker,
  reactionPickerEvents,
} from "../ReactionPicker/ReactionPicker";
import {
  RangeChangeEvent,
  rangeEvents,
  VerticalRange,
} from "../VerticalRange/VerticalRange";
import { ComplexComponent } from "../../interfaces/ComplexComponent";
import { reactionToHex, TopicHolder } from "../../models/TopicHolder";
import { EmotionalReaction } from "../../api";
import { cssUtilsSheet } from "../../styles/cssUtils";
import { addShortcut, shortcuts } from "../../utils/keyboardShortcuts";

export const selectors = {
  labelInput: ".label-input",
  reactions: [".reactions-left", ".reactions-right"],
  ranges: [".range-left", ".range-right"],
  labels: [".label-left", ".label-right"],
  removeBtn: ".remove-btn",
  jarIllustration: ".jar-illustration",
};

export interface JarTileProps {
  topic: TopicHolder;
}

export const defaultJarTileProps = {
  topic: new TopicHolder(),
};
export class JarTile
  extends HTMLElement
  implements ComplexComponent<JarTileProps>
{
  private topic = defaultJarTileProps.topic;

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
    this.shadowRoot!.adoptedStyleSheets = [cssUtilsSheet];
  }

  connectedCallback() {
    this.setupEventListeners();

    this.updateIllustration();
  }

  setProps(props: JarTileProps) {
    this.topic = props.topic;

    this.updateLabelElt(props.topic.name);
    props.topic.emotions.forEach((emotion, i) => {
      this.updateReaction(i, emotion.reaction);
      this.updateStrength(i, emotion.strength);
      this.updateProducer(i, emotion.producer);
    });

    this.updateIllustration();
  }

  export(): TopicHolder {
    return this.topic;
  }

  private setupEventListeners() {
    this.handleRemove();
    this.handleReactionChanges();
    this.handleFillChanges();
    this.handleLabelChanges();
  }

  private updateReaction(emotionIdx: number, reaction?: EmotionalReaction) {
    if (!reaction) {
      console.warn(
        "JarTile: Updating reaction failed. No reaction found",
        reaction,
      );
      return;
    }
    this.topic.emotions[emotionIdx].reaction = reaction;
    this.updateProducerReaction(selectors.labels[emotionIdx], reaction);
    this.updateReactionElt(selectors.reactions[emotionIdx], reaction);
    this.updateIllustration();
  }

  private updateStrength(emotionIdx: number, strength?: number) {
    if (strength === undefined) {
      console.warn("Updating strength failed. No strength found", strength);
      return;
    }

    this.topic.emotions[emotionIdx].strength = strength;
    this.updateStrengthElt(selectors.ranges[emotionIdx], strength);
    this.updateIllustration();
  }

  private updateReactionElt(selector: string, reaction: EmotionalReaction) {
    const picker = queryElt<ReactionPicker>(this.shadowRoot, selector);
    if (!picker) {
      return;
    }

    picker.setAttribute("initialreaction", reaction);
  }

  private updateProducer(emotionIdx: number, producer: string) {
    const selector = selectors.labels[emotionIdx];
    const sideLabel = queryElt<SideLabel>(this.shadowRoot, selector);

    if (!sideLabel) {
      return;
    }
    sideLabel.label = producer;
  }

  private updateProducerReaction(
    selector: string,
    reaction: EmotionalReaction,
  ) {
    const sideLabel = queryElt<SideLabel>(this.shadowRoot, selector);

    if (!sideLabel) {
      console.warn("JarTile: No sidelabel elt found!", {
        selector,
        color: reaction,
      });
      return;
    }
    sideLabel.reaction = reaction;
  }

  private updateLabelElt(topicName: string) {
    const labelElt = queryElt<HTMLTextAreaElement>(
      this.shadowRoot,
      selectors.labelInput,
    );
    if (!labelElt) {
      console.warn("JarTile: No label elt found");
      return;
    }
    labelElt.value = topicName;
    this.topic.name = topicName;
  }

  private updateStrengthElt(selector: string, level: number) {
    const rangeElt = queryElt<VerticalRange>(this.shadowRoot, selector);

    if (!rangeElt) {
      return;
    }

    rangeElt.rangevalue = level;
  }

  private getLabelElt() {
    return queryElt<HTMLTextAreaElement>(this.shadowRoot, selectors.labelInput);
  }

  private handleLabelChanges = () => {
    this.getLabelElt()?.addEventListener("input", (e) => {
      const newLabel = (e.target as HTMLInputElement).value;
      this.updateLabelElt(newLabel);
    });
  };

  private handleFillChanges = () => {
    selectors.ranges.forEach((rangeSelector, i) => {
      const rangeElt = queryElt(this.shadowRoot, rangeSelector);

      if (!rangeElt) {
        console.warn("Error setting range events. Element(s) not found", {
          rangeElt,
          i,
          rangeSelector,
        });
        return;
      }
      handleCustomEvent<CustomEventInit<RangeChangeEvent>>(
        rangeElt,
        rangeEvents.rangechange,
        (detail) => this.updateStrength(i, Number(detail?.value)),
      );
    });
  };

  private handleReactionChanges = () => {
    selectors.reactions.forEach((reactionSelector, i) => {
      const reactionElt = queryElt(this.shadowRoot, reactionSelector);

      if (!reactionElt) {
        console.warn("Error setting color events. Element(s) not found", {
          colorElt: reactionElt,
          i,
          colorSelector: reactionSelector,
        });
        return;
      }

      handleCustomEvent<CustomEventInit<ReactionChangeEvent>>(
        reactionElt,
        reactionPickerEvents.reactionchange,
        (detail) => {
          this.updateReaction(i, detail?.reaction);
        },
      );
    });
  };

  private updateIllustration() {
    const jarIllustrationElt = queryElt<JarIllustration>(
      this.shadowRoot,
      selectors.jarIllustration,
    );

    if (!jarIllustrationElt) {
      console.warn("No jar illustration yet");
      return;
    }

    jarIllustrationElt.reactionleft = this.topic.emotions[0].reaction;
    jarIllustrationElt.reactionright = this.topic.emotions[1].reaction;
    jarIllustrationElt.strengthleft = this.topic.emotions[0].strength;
    jarIllustrationElt.strengthright = this.topic.emotions[1].strength;
  }

  private handleRemove = () => {
    const removeBtn = queryElt(this.shadowRoot, selectors.removeBtn)!;
    removeBtn.addEventListener("click", () => this.remove());

    addShortcut({
      shortcut: shortcuts.tile.remove,
      action: () => {
        this.remove();
      },
      guard: () => !!this.shadowRoot?.contains(this.shadowRoot.activeElement),
    });
  };
}

export const jarTileTag = "jar-tile";
defineCustomElt(jarTileTag, JarTile);
