linter = require "./linter"
module.exports =
  config:
    validateOnSave:
      type: 'boolean'
      default: true
    validateOnChange:
      type: 'boolean'
      default: false
    hideOnNoErrors:
      type: 'boolean'
      default: false

  activate: ->
    editor = atom.workspace.getActiveTextEditor()
    subscriptions =
      onSave: null
      onChange: null

    atom.commands.add "atom-workspace", "jsonlint:lint", linter
    atom.config.observe "jsonlint.validateOnSave", (value) ->
      if value is true
        atom.workspace.observeTextEditors (editor) ->
          subscriptions.onSave = editor.buffer.onDidSave linter
      else
        atom.workspace.observeTextEditors (editor) ->
          subscriptions.onSave?.dispose()

    atom.config.observe "jsonlint.validateOnChange", (value) ->
      if value is true
        atom.workspace.observeTextEditors (editor) ->
          subscriptions.onChange = editor.buffer.onDidStopChanging linter
      else
        atom.workspace.observeTextEditors (editor) ->
          subscriptions.onChange?.dispose()
