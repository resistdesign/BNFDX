type TokenProcessorOptionType = '*' | '+' | '?';

export type TokenValidatorOptionsConfig<TokenTypes extends string> = {
  value: TokenValidator<TokenTypes>;
  option: TokenProcessorOptionType;
};

export type TokenValidator<TokenTypes extends string> = TokenTypes | RegExp | TokenValidatorOptionsConfig<TokenTypes> | TokenValidator<TokenTypes>[];

export type BaseGrammarMapType<TokenTypes extends string> = {
  [type in TokenTypes]: TokenValidator<TokenTypes>;
};

export type Grammar<TokenTypes extends string> = {
  entry: TokenTypes;
  map: BaseGrammarMapType<TokenTypes>;
};

export type AST<TokenTypes extends string> =
  | string
  | {
      tokenType: TokenTypes;
      value: AST<TokenTypes>;
    }
  | AST<TokenTypes>[];

type TokenValidatorOptionProcessorResults = {
  consumedString: string;
  newCurrentIndex: number;
};
type TokenValidatorOptionProcessor = <TokenTypes extends string>(
  syntaxString: string,
  currentIndex: number,
  tokenValidator: TokenValidator<TokenTypes>
) => TokenValidatorOptionProcessorResults;
type TokenValidatorOptionProcessorMap = {
  [type in TokenProcessorOptionType]: TokenValidatorOptionProcessor;
};

const TOKEN_VALIDATOR_OPTION_PROCESSORS: TokenValidatorOptionProcessorMap = {
  '*': <TokenTypes extends string>(syntaxString: string, currentIndex: number, tokenValidator: TokenValidator<TokenTypes>) => {},
  '+': <TokenTypes extends string>(syntaxString: string, currentIndex: number, tokenValidator: TokenValidator<TokenTypes>) => {},
  '?': <TokenTypes extends string>(syntaxString: string, currentIndex: number, tokenValidator: TokenValidator<TokenTypes>) => {},
};

export const parseSyntaxString = <TokenTypes extends string>(syntaxString: string, grammar: Grammar<TokenTypes>): AST<TokenTypes> => {
  const { entry, map } = grammar;

  return {} as any;
};
