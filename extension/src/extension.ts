import * as vscode from "vscode";
import { Constants } from "./constants";
import { URLSearchParams } from "url";

interface RangeResult {
  isWithinBounds: boolean;
  error?: BoundError;
}

interface Params {
  theme: "mellow" | "aqua";
  fontSize?: string;
  font?: string;
  lang?: string;
  snippet: string;
}

enum BoundError {
  BELOW_LOWER_BOUND = Constants.BELOW_LOWER_BOUND,
  ABOVE_UPPER_BOUND = Constants.ABOVE_UPPER_BOUND,
}

let takeACodeShotStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
  const commandId = Constants.COMMAND_ID;

  subscriptions.push(
    vscode.commands.registerCommand(commandId, () => {
      let n = getNumberOfSelectedCharacters(vscode.window.activeTextEditor);
      const result = checkBounds(n);
      if (result.isWithinBounds) {
        const urlParams = getParams();
        vscode.env.openExternal(
          vscode.Uri.parse(`${Constants.BASE_URL}?${urlParams}`)
        );
      } else {
        let message = "";
        switch (result.error) {
          case BoundError.BELOW_LOWER_BOUND:
            message = `Snippet should not be shorter than ${
              BoundError.BELOW_LOWER_BOUND
            } character${BoundError.BELOW_LOWER_BOUND !== 1 ? "s" : ""}`;
            break;
          case BoundError.ABOVE_UPPER_BOUND:
            message = `Snippet should not be longer than ${
              BoundError.ABOVE_UPPER_BOUND
            } character${BoundError.ABOVE_UPPER_BOUND !== 1 ? "s" : ""}`;
        }

        vscode.window.showErrorMessage(message);
      }
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand(Constants.COMMAND_ID_SPLIT_VIEW, () => {
      let n = getNumberOfSelectedCharacters(vscode.window.activeTextEditor);
      const result = checkBounds(n);
      if (!result.isWithinBounds) {
        let message = "";
        switch (result.error) {
          case BoundError.BELOW_LOWER_BOUND:
            message = `Snippet should not be shorter than ${
              BoundError.BELOW_LOWER_BOUND
            } character${BoundError.BELOW_LOWER_BOUND !== 1 ? "s" : ""}`;
            break;
          case BoundError.ABOVE_UPPER_BOUND:
            message = `Snippet should not be longer than ${
              BoundError.ABOVE_UPPER_BOUND
            } character${BoundError.ABOVE_UPPER_BOUND !== 1 ? "s" : ""}`;
        }

        return vscode.window.showErrorMessage(message);
      }

      const panel = vscode.window.createWebviewPanel(
        "takeACodeshot",
        "Take a Codeshot",
        vscode.ViewColumn.Beside,
        {}
      );
      const urlParams = getParams();
      panel.webview.html = getWebviewContent(urlParams);
    })
  );

  takeACodeShotStatusBarItem = vscode.window.createStatusBarItem(
    Constants.STATUS_BAR_ITEM_ALIGNMENT,
    Constants.STATUS_BAR_ITEM_WIDTH
  );
  takeACodeShotStatusBarItem.command = commandId;
  subscriptions.push(takeACodeShotStatusBarItem);

  subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
  );
  subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
  );

  updateStatusBarItem();
}

/**
 * Handles visibity of status bar item
 */
function updateStatusBarItem(): void {
  let n = getNumberOfSelectedCharacters(vscode.window.activeTextEditor);
  if (checkBounds(n).isWithinBounds) {
    takeACodeShotStatusBarItem.text = `$(device-camera) Take a Codeshot`;
    takeACodeShotStatusBarItem.show();
  } else {
    takeACodeShotStatusBarItem.hide();
  }
}

/**
 * Middleware to check snippet length
 * @param characters Number of characters in snippet
 */
function checkBounds(characters: number): RangeResult {
  if (characters < BoundError.BELOW_LOWER_BOUND) {
    return { isWithinBounds: false, error: BoundError.BELOW_LOWER_BOUND };
  }
  if (characters > BoundError.ABOVE_UPPER_BOUND) {
    return { isWithinBounds: false, error: BoundError.ABOVE_UPPER_BOUND };
  }

  return { isWithinBounds: true };
}

/**
 * calculates the number of characters in selected snippet
 * @param editor VS Code Text Editor instance
 */
function getNumberOfSelectedCharacters(
  editor: vscode.TextEditor | undefined
): number {
  let characters = 0;

  if (editor && editor.selection) {
    characters = editor.document.getText(editor.selection).length;
  }

  return characters;
}

/**
 * Returns a URL encoded string of params
 */
function getParams(): string {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const params: Params = {
      theme: "mellow",
      fontSize: Constants.CONFIG.fontSize,
      font: Constants.CONFIG.font,
      lang: Constants.CONFIG.lang,
      snippet: editor.document.getText(editor.selection),
    };
    return new URLSearchParams(Object(params)).toString();
  }

  throw new Error("Editor was not found");
}

/**
 * Returns an HTML document with am embedded IFrame to Base URL
 * @param urlParams The URL Parameters string
 */
function getWebviewContent(urlParams: string) {
  return `<!DOCTYPE html>
<html lang="en" style="min-height: 100%; height: 100%;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Take a Codeshot</title>
		
</head>
<body style="min-height: 100%; height: 100%;">
<iframe style="min-height: 100%; height: 100%;" src="${Constants.BASE_URL}?${urlParams}" width="100%" frameborder="0" height: "100%" />
</iframe>
</body>
</html>`;
}
