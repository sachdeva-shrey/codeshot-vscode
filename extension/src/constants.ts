import { StatusBarAlignment } from "vscode";

export const Constants = {
  COMMAND_ID: "codeshot.takeACodeshot",
  COMMAND_ID_SPLIT_VIEW: "codeshot.takeACodeshotInSplitView",
  BELOW_LOWER_BOUND: 1,
  ABOVE_UPPER_BOUND: 1001,
  STATUS_BAR_ITEM_WIDTH: 100,
  BASE_URL: "https://srmkzilla.net/",
  STATUS_BAR_ITEM_ALIGNMENT: StatusBarAlignment.Right,
  CONFIG: {
    theme: "mellow",
    fontSize: "12",
    font: "monospace",
    lang: "swift",
  },
};
