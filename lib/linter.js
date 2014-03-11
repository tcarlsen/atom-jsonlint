/*global atom, require, module*/

var JSONLINT = require('jsonlint').parser;
var msgPanel = require('atom-message-panel');

module.exports = function () {
    'use strict';

    var editor = atom.workspace.getActiveEditor(),
        content = editor.getText(),
        langues = editor.getGrammar().name;

    if (langues === 'JSON') {
        if (atom.workspaceView.find('.am-panel').length !== 1) {
            msgPanel.init('JSON Lint report');
        } else {
            msgPanel.clear();
        }

        try {
            JSONLINT.parse(content);

            msgPanel.append.header('√ No errors were found!', 'text-success');
        } catch (error) {
            error.line = error.message.split(':')[0].split('line ')[1];
            error.message = error.message.substr(error.message.indexOf(':') + 1);

            msgPanel.append.lineMessage(error.line, 0, null, error.message, 'text-error');
        }

        atom.workspaceView.on('pane-container:active-pane-item-changed destroyed', function () {
            msgPanel.destroy();
        });
    }
};
