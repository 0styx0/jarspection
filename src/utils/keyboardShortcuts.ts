export type Trigger = {
  trigger: string[];
};

type ShortcutAction = {
  triggers: Trigger[];
  description: string;
};

export const actionTriggers = {
  keyboard: "keyboard",
  mouse: "mouse",
} as const;
export type ActionTrigger =
  (typeof actionTriggers)[keyof typeof actionTriggers];

export const shortcuts = {
  help: {
    viewShortcuts: {
      triggers: [{ trigger: ["?"] }],
      description: "View shortcuts",
    },
  },
  tile: {
    add: {
      triggers: [{ trigger: ["Meta", "N"] }],
      description: "Add new tile",
    },
    remove: {
      triggers: [{ trigger: ["Meta", "W"] }],
      description: "Remove current tile",
    },
    focusNext: {
      triggers: [{ trigger: ["Meta", "ArrowLeft"] }],
      description: "Select next tile",
    },
    focusPrevious: {
      triggers: [{ trigger: ["Meta", "ArrowRight"] }],
      description: "Select previous tile",
    },
  },
} as Record<string, Record<string, ShortcutAction>>;

function isShortcutPressed(
  event: KeyboardEvent,
  shortcutAction: ShortcutAction,
): boolean {
  const { key, ctrlKey, altKey, metaKey } = event;

  return shortcutAction.triggers.some(({ trigger }) =>
    trigger.every((k) => {
      switch (k) {
        case "Ctrl":
          return ctrlKey;
        case "Meta":
          return metaKey; // Cmd on macOS or Windows key on Windows
        case "Alt":
          return altKey;
        default:
          return key.toUpperCase() === k.toUpperCase();
      }
    }),
  );
}

interface AddShortcutParams {
  shortcut: ShortcutAction;
  action: Function;
  guard?: () => boolean; // Optional guard, defaulting to true if not provided
}

export const addShortcut = ({
  shortcut,
  action,
  guard = () => true,
}: AddShortcutParams) => {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (!isShortcutPressed(event, shortcut) || !guard()) {
      return;
    }
    event.preventDefault();
    action();
  });
};

// might add later after
//
// tag: {
//   add: "Tag tile",
//   remove: "Tag remove tile",
// },
// select: {
//   side: "selectSide",
//   tile: "selectTile",
// },
// sideN: {
//   reaction: "Edit reaction",
//   intensity: "Edit intensity",
//   producer: "Edit producer",
// },
// page: {
//   switchToTag: "Switch to tag",
// },
