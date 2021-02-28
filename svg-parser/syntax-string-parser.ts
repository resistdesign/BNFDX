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

export type GrammarMapTokenTypeDescriptor<TokenTypes extends string> = {
  options: TokenValidator<TokenTypes>[];
};

export type BaseGrammarMapType<TokenTypes extends string> = {
  [type in TokenTypes]: GrammarMapTokenTypeDescriptor<TokenTypes>;
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
    const resultList = [];

    for (const t of tokenValidator) {
      const result = processTokenValidator<TokenTypes>(syntaxString, tokenType, t, grammarMap, currentIndex);

      if (!result) {
        return false;
      }

      resultList.push(result);
    }

    return resultList;
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
    const { options = [] } = grammarMap[tokenValidator];

    for (const t of options) {
      // TRICKY: Here, the new `tokenType` in the `tokenValidator` which is a string.
      const result = processTokenValidator(syntaxString, tokenValidator, t, grammarMap, currentIndex);

      if (result) {
        return result;
      }
    }
  }

  return false;
};

export const parseSyntaxString = <TokenTypes extends string>(syntaxString: string = '', grammar: Grammar<TokenTypes>): AST<TokenTypes> | false => {
  const { entry, map } = grammar;

  return processTokenValidator(syntaxString, entry, entry, map, 0);
};
