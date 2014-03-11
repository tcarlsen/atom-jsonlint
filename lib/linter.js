/*global atom, require, module*/

var JSONLINT = require('jsonlint').parser;

module.exports = function () {
    'use strict';

    var editor = atom.workspace.getActiveEditor(),
        content = editor.getText(),
        langues = editor.getGrammar().name,
        pre,
        addClick = function (pre, line) {
            pre.click(function () {
                editor.cursors[0].setBufferPosition([line - 1, 0]);
            });
        };

    if (langues === 'JSON') {
        if (atom.workspaceView.find('.jsonlint').length !== 1) {
            atom.workspaceView.prependToBottom('<div class="jsonlint tool-panel panel-bottom" />');
            atom.workspaceView.find('.jsonlint')
                .append('<div class="panel-heading">JSON Lint report <button type="button" class="close" aria-hidden="true">&times;</button></div>')
                .append('<div class="panel-body padded" />');
            atom.workspaceView.find('.jsonlint .close').click(function () {
                atom.workspaceView.find('.jsonlint').remove();
            });
        } else {
            atom.workspaceView.find('.jsonlint .panel-body').html('');
        }

        try {
            JSONLINT.parse(content);

            atom.workspaceView.find('.jsonlint .panel-body').append('<h1 class="text-success">√ No errors was found!</h1>');
        } catch (error) {
            error.line = error.message.split(':')[0].split('line ')[1];
            error.message = error.message.substr(error.message.indexOf(':') + 1);

            atom.workspaceView.find('.jsonlint .panel-body')
                .append('<div class="text-subtle inline-block">at line ' + String(error.line) + '</div>')
                .append('<pre class="text-error">' + error.message + '</pre>');

            pre = atom.workspaceView.find('.jsonlint .panel-body pre');

            addClick(pre, error.line);
        }

        atom.workspaceView.on('pane-container:active-pane-item-changed destroyed', function () {
            atom.workspaceView.find('.jsonlint').remove();
        });
    }
};
