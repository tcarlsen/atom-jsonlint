linter = require "./linter"
module.exports =
  configDefaults:
    validateOnSave: true
    validateOnChange: false
    hideOnNoErrors: false

  activate: ->
    editor = atom.workspace.getActiveTextEditor()

    atom.commands.add "atom-workspace", "jsonlint:lint", linter
    atom.config.observe "jsonlint.validateOnSave", (value) ->
      if value is true
        atom.workspace.eachEditor (editor) ->
          editor.buffer.on "saved", linter
      else
        atom.workspace.eachEditor (editor) ->
          editor.buffer.off "saved", linter

    atom.config.observe "jsonlint.validateOnChange", (value) ->
      if value is true
        atom.workspace.eachEditor (editor) ->
          editor.buffer.on "contents-modified", linter
      else
        atom.workspace.eachEditor (editor) ->
          editor.buffer.off "contents-modified", linter
