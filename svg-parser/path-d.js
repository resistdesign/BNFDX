// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "input", "symbols": ["optional_white_space", "commands", "optional_white_space"]},
    {"name": "white_space", "symbols": [/[ \t]/]},
    {"name": "divider", "symbols": [{"literal":","}]},
    {"name": "divider$ebnf$1", "symbols": ["white_space"]},
    {"name": "divider$ebnf$1", "symbols": ["divider$ebnf$1", "white_space"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "divider", "symbols": ["divider$ebnf$1"]},
    {"name": "optional_white_space$ebnf$1", "symbols": []},
    {"name": "optional_white_space$ebnf$1", "symbols": ["optional_white_space$ebnf$1", "white_space"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "optional_white_space", "symbols": ["optional_white_space$ebnf$1"]},
    {"name": "digit", "symbols": [/[0-9]/]},
    {"name": "digits$ebnf$1", "symbols": ["digit"]},
    {"name": "digits$ebnf$1", "symbols": ["digits$ebnf$1", "digit"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "digits", "symbols": ["digits$ebnf$1"]},
    {"name": "decimal", "symbols": [{"literal":"."}]},
    {"name": "operator", "symbols": [{"literal":"+"}]},
    {"name": "operator", "symbols": [{"literal":"-"}]},
    {"name": "value", "symbols": ["digits"]},
    {"name": "value", "symbols": ["decimal", "digits"]},
    {"name": "value", "symbols": ["digits", "decimal", "digits"]},
    {"name": "value", "symbols": ["operator", "digits"]},
    {"name": "value", "symbols": ["operator", "decimal", "digits"]},
    {"name": "value", "symbols": ["operator", "digits", "decimal", "digits"]},
    {"name": "values", "symbols": ["value"]},
    {"name": "values", "symbols": ["value", "values"]},
    {"name": "values", "symbols": ["value", "divider", "values"]},
    {"name": "commandName", "symbols": [/[a-zA-Z]/]},
    {"name": "command", "symbols": ["commandName", "values"]},
    {"name": "command", "symbols": ["commandName", "optional_white_space", "values"]},
    {"name": "commands", "symbols": ["command"]},
    {"name": "commands", "symbols": ["command", "commands"]},
    {"name": "commands", "symbols": ["command", "optional_white_space", "commands"]}
]
  , ParserStart: "input"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
