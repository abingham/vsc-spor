import * as vscode from 'vscode';
import { spawn } from 'child_process';

import { window, TextEditorDecorationType, Range, QuickPickItem } from 'vscode';

let dec_type = vscode.window.createTextEditorDecorationType({
	backgroundColor: "#00ff0055",
});

export function activate(context: vscode.ExtensionContext) {

	vscode.commands.registerCommand('spor.highlight_anchors', () => {

		vscode.window.visibleTextEditors.forEach(editor => {
			// TODO: The location of the spor executable needs to be configurable.
			// TODO: This needs to be executed in the directory containing the file
			const list = spawn('spor', ['list', '--json', editor.document.fileName]);

			// TODO: Do we get the output piecemeal here, or all of it at the end of execution?
			list.stdout.on('data', (data: string) => {
				const anchors = JSON.parse(data);
				const decs: vscode.Range[] = [];
				anchors.forEach(anchor_obj => {
					const anchor = anchor_obj.anchor;
					// TODO: Need to convert context offset into line/col for the range here.
					decs.push(new Range(1, anchor.context.offset, 1, anchor.context.offset + anchor.context.topic.length));
				});

				editor.setDecorations(dec_type, decs);
			});
		});
	});
}

export function deactivate() { }
