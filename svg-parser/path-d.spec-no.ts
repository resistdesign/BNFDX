import Path from 'path';
import FS from 'fs';
import { CompiledRules, Grammar, Parser } from 'nearley';
// @ts-ignore
import compile from 'nearley/lib/compile';
// @ts-ignore
import generate from 'nearley/lib/generate';
// @ts-ignore
import nearleyGrammar from 'nearley/lib/nearley-language-bootstrapped';

function compileGrammar(sourceCode: string): CompiledRules {
  // Parse the grammar source into an AST
  const grammarParser = new Parser(nearleyGrammar);
  grammarParser.feed(sourceCode);
  const grammarAst = grammarParser.results[0];

  // Compile the AST into a set of rules
  const grammarInfoObject = compile(grammarAst, {});
  // Generate JavaScript code from the rules
  const grammarJs = generate(grammarInfoObject, 'grammar');

  // Pretend this is a CommonJS environment to catch exports from the grammar.
  const module = { exports: {} };
  eval(grammarJs);

  return module.exports as any;
}

const PathDDef = FS.readFileSync(Path.join(__dirname, 'path-d.ne'), {
  encoding: 'utf8',
});
const DemoPathD = 'm25.645 38.743c2.061 2.882 8.35 3.09 10.51 1.868.793-.449.991-1.747.991-2.627 0-.604-.159-1.079-.477-1.424-.336-.345-1.189-1.221-2.178-1.48-5.02-1.294-8.492-2.911-9.852-4.085-1.696-1.467-1.969-2.425-1.969-4.979 0-2.554.734-4.695 2.395-6.231 1.66-1.536 4.071-2.304 7.233-2.304 3.02 0 7.268.797 9.339 3.256l-3.453 3.756c-1.947-1.635-3.396-1.783-5.78-1.783-1.501 0-2.283.216-2.919.647-.636.414-.954.958-.954 1.631 0 .604.291 1.105.874 1.501.583.414 2.106 1.036 5.144 1.864 3.409.932 5.723 2.062 6.942 3.391 1.201 1.329 1.802 3.098 1.802 5.307 0 2.658-.936 4.85-2.808 6.575-1.855 1.726-4.138 3.067-7.423 3.067-4.229 0-9.874-1.494-11.431-4.255';

describe('Path D', () => {
  test('should parse svg path d data', () => {
    const grammar = compileGrammar(PathDDef);
    const parser = new Parser(Grammar.fromCompiled(grammar));

    parser.feed(DemoPathD);

    const results = parser.results;

    console.log('Number Of Results:', results.length, JSON.stringify(results, null, 2));

    expect(results.length).toBeGreaterThan(0);
  });
});
