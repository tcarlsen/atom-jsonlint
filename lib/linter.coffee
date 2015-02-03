{MessagePanelView, PlainMessageView, LineMessageView} = require 'atom-message-panel'
jsonLint = require("jsonlint")
messages = new MessagePanelView
  title: "<span class=\"icon-bug\"></span> JSON Lint report"
  rawTitle: true
  closeMethod: "destroy"
editor = null
content = null
result = null

module.exports = ->
  editor = atom.workspace.getActiveTextEditor()

  return unless editor
  return unless editor.getGrammar().name is "JSON"

  content = editor.getText()

  messages.clear()
  messages.attach()

  try
    jsonLint.parse content

    atom.config.observe "jsonlint.hideOnNoErrors", (value) ->
      if value is true
        messages.close()
      else
        messages.add new PlainMessageView
          message: "No errors were found!"
          className: "text-success"
  catch error
    messages.add new LineMessageView
      message: "Expecting " + error.message.split("Expecting")[1]
      line: error.message.split(":")[0].split("line ")[1]
      preview: error.message.substr(error.message.indexOf(":") + 1).split("Expecting")[0].trim()
      className: "text-error"

  atom.workspace.onDidChangeActivePaneItem ->
    messages.close()
