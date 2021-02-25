export type TokenValidatorOptionsConfig<GrammarMapType> = {
  value: TokenValidator<GrammarMapType>;
  option: '*' | '+' | '?';
};

export type TokenValidator<GrammarMapType> =
  | keyof GrammarMapType
  | RegExp
  | TokenValidatorOptionsConfig<GrammarMapType>
  | TokenValidator<GrammarMapType>[];

export type BaseGrammarMapType<GrammarMapType> = {
  [key in keyof GrammarMapType]: TokenValidator<GrammarMapType>;
};

export type Grammar<MapType extends BaseGrammarMapType<MapType>> = {
  entry: keyof MapType;
  map: BaseGrammarMapType<MapType>;
};

export type AST<GrammarMapType> =
  | string
  | {
      tokenType: keyof GrammarMapType;
      value: AST<GrammarMapType>;
    }
  | AST<GrammarMapType>[];

export const parseSyntaxString = <GrammarMapType extends BaseGrammarMapType<GrammarMapType>>(
  syntaxString: string,
  grammar: Grammar<GrammarMapType>
): AST<GrammarMapType> => {
  const { entry, map } = grammar;

  return {} as any;
};
