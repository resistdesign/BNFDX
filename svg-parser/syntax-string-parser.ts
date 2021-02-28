export enum TokenProcessorOptionTypes {
  '*' = '*',
  '+' = '+',
  '?' = '?',
}

export type TokenValidatorOptionsConfig<TokenTypes extends string> = {
  value: TokenValidator<TokenTypes>;
  option: TokenProcessorOptionTypes;
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
  | {
      startIndex: number;
      endIndex: number;
      tokenType: TokenTypes;
      value: string | AST<TokenTypes>;
    }
  | AST<TokenTypes>[];

type TokenValidatorOptionProcessorResults =
  | {
      consumedString: string;
      newCurrentIndex: number;
    }
  | false;
type TokenValidatorOptionProcessor = <TokenTypes extends string>(
  syntaxString: string,
  currentIndex: number,
  tokenValidator: TokenValidator<TokenTypes>
) => TokenValidatorOptionProcessorResults;
type TokenValidatorOptionProcessorMap = {
  [key in TokenProcessorOptionTypes]: TokenValidatorOptionProcessor;
};

const PROCESS_REGEX = (syntaxString: string, currentIndex: number, tokenValidator: RegExp): TokenValidatorOptionProcessorResults => {
  const stringFromIndex = syntaxString.slice(currentIndex);
  const match = stringFromIndex.match(tokenValidator);

  if (match) {
    const consumedString = match[0] || '';

    return {
      consumedString,
      newCurrentIndex: currentIndex + consumedString.length,
    };
  }

  return false;
};
// TODO: These need to return (and probably receive) the same things as `processTokenValidator`,
//  as well as option related info.
const TOKEN_VALIDATOR_OPTION_PROCESSORS: TokenValidatorOptionProcessorMap = {
  [TokenProcessorOptionTypes['*']]: <TokenTypes extends string>(
    syntaxString: string,
    currentIndex: number,
    tokenValidator: TokenValidator<TokenTypes>
  ): TokenValidatorOptionProcessorResults => {},
  [TokenProcessorOptionTypes['+']]: <TokenTypes extends string>(
    syntaxString: string,
    currentIndex: number,
    tokenValidator: TokenValidator<TokenTypes>
  ): TokenValidatorOptionProcessorResults => {},
  [TokenProcessorOptionTypes['?']]: <TokenTypes extends string>(
    syntaxString: string,
    currentIndex: number,
    tokenValidator: TokenValidator<TokenTypes>
  ): TokenValidatorOptionProcessorResults => {},
};

const processTokenValidator = <TokenTypes extends string>(
  syntaxString: string,
  tokenType: TokenTypes,
  tokenValidator: TokenValidator<TokenTypes>,
  grammarMap: BaseGrammarMapType<TokenTypes>,
  currentIndex
): AST<TokenTypes> | false => {
  if (tokenValidator instanceof Array) {
    // A combination of types.
    for (const t of tokenValidator) {
      const result = processTokenValidator<TokenTypes>(syntaxString, tokenType, t, grammarMap, currentIndex);

      // TODO: This is wrong, it needs to be treated as an AND.
      if (result) {
        return result;
      }
    }
  } else if (tokenValidator instanceof RegExp) {
    // RegExp: Direct compare.
    const result = PROCESS_REGEX(syntaxString, tokenType, currentIndex, tokenValidator);

    if (result) {
      const { consumedString, newCurrentIndex } = result;

      return {
        startIndex: currentIndex,
        endIndex: newCurrentIndex - 1,
        tokenType: tokenType,
        value: consumedString,
      };
    }
  } else if (tokenValidator instanceof Object) {
    // Use a TokenValidatorOptionProcessor
    const { value: t, option } = tokenValidator;
    const optionProcessor = TOKEN_VALIDATOR_OPTION_PROCESSORS[option];
    const result = optionProcessor<TokenTypes>(syntaxString, currentIndex, t);

    if (result) {
      const { consumedString, newCurrentIndex } = result;

      return {
        startIndex: currentIndex,
        endIndex: newCurrentIndex - 1,
        value: consumedString,
        tokenType,
      };
    }
  } else {
    // string: Get from map
    const t = grammarMap[tokenValidator];

    // TODO: Consider a list of options. An array of OR token validators.

    return processTokenValidator(syntaxString, tokenValidator, t, grammarMap, currentIndex);
  }

  return false;
};

export const parseSyntaxString = <TokenTypes extends string>(syntaxString: string = '', grammar: Grammar<TokenTypes>): AST<TokenTypes> | false => {
  const { entry, map } = grammar;

  return processTokenValidator(syntaxString, entry, entry, map, 0);
};
