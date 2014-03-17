/*global atom, require, module*/

var JSONLINT = require('jsonlint').parser;
var msgPanel = require('atom-message-panel');

module.exports = function () {
    'use strict';

    var editor = atom.workspace.getActiveEditor(),
        content;

    if (!editor) {
        return;
    }

    if (editor.getGrammar().name === 'JSON') {
        content = editor.getText();

        if (atom.workspaceView.find('.am-panel').length !== 1) {
            msgPanel.init('JSON Lint report');
        } else {
            msgPanel.clear();
        }

        try {
            JSONLINT.parse(content);

            atom.config.observe('jsonlint.hideOnNoErrors', {callNow: true}, function (value) {
                if (value === true) {
                    msgPanel.destroy();
                } else {
                    msgPanel.append.header('√ No errors were found!', 'text-success');
                }
            });
        } catch (error) {
            error.line = error.message.split(':')[0].split('line ')[1];
            error.evidence = error.message.substr(error.message.indexOf(':') + 1).split('Expecting')[0].trim();
            error.message = 'Expecting ' + error.message.split('Expecting')[1];

            msgPanel.append.lineMessage(error.line, 0, error.message, error.evidence, 'text-error');
        }

        atom.workspaceView.on('pane-container:active-pane-item-changed destroyed', function () {
            msgPanel.destroy();
        });
    }
};
