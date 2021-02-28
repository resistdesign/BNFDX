export enum TokenProcessorOptionTypes {
  ZERO_OR_MORE = '*',
  ONE_OR_MORE = '+',
  ZERO_OR_ONE = '?',
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

export type AST<TokenTypes extends string> = {
  startIndex: number;
  endIndex: number;
  tokenType: TokenTypes;
  value: string | AST<TokenTypes>[];
  valueLength: number;
};

type TokenValidationProcessorReturnValue<TokenTypes extends string> = AST<TokenTypes> | false;
type TokenValidationProcessor = <TokenTypes extends string>(
  syntaxString: string,
  tokenType: TokenTypes,
  tokenValidator: TokenValidator<TokenTypes>,
  grammarMap: BaseGrammarMapType<TokenTypes>,
  currentIndex: number
) => TokenValidationProcessorReturnValue<TokenTypes>;
type TokenValidatorOptionProcessorMap = {
  [key in TokenProcessorOptionTypes]: TokenValidationProcessor;
};

const PROCESS_REGEX: TokenValidationProcessor = <TokenTypes extends string>(
  syntaxString: string,
  tokenType: TokenTypes,
  tokenValidator: TokenValidator<TokenTypes>,
  _grammarMap: BaseGrammarMapType<TokenTypes>,
  currentIndex: number
): TokenValidationProcessorReturnValue<TokenTypes> => {
  if (tokenValidator instanceof RegExp) {
    const stringFromIndex = syntaxString.slice(currentIndex);
    const match = stringFromIndex.match(tokenValidator);

    if (match && match.length > 0) {
      const firstMatch = match[0] || '';

      // TRICKY: IMPORTANT: Make sure the match is at the beginning of the string being searched.
      // WARNING: Unwanted recursion could occur without this check.
      if (!!firstMatch && stringFromIndex.indexOf(firstMatch) === 0) {
        return {
          startIndex: currentIndex,
          endIndex: currentIndex + (firstMatch.length - 1),
          value: firstMatch,
          valueLength: firstMatch.length,
          tokenType,
        };
      }
    }
  }

  return false;
};
const TOKEN_VALIDATOR_OPTION_PROCESSORS: TokenValidatorOptionProcessorMap = {
  [TokenProcessorOptionTypes.ZERO_OR_MORE]: <TokenTypes extends string>(
    syntaxString: string,
    tokenType: TokenTypes,
    tokenValidator: TokenValidator<TokenTypes>,
    grammarMap: BaseGrammarMapType<TokenTypes>,
    currentIndex: number
  ): TokenValidationProcessorReturnValue<TokenTypes> => {
    const results: AST<TokenTypes>[] = [];

    let latestCurrentIndex = currentIndex;

    while (true) {
      const resultAst = processTokenValidator<TokenTypes>(syntaxString, tokenType, tokenValidator, grammarMap, latestCurrentIndex);

      if (resultAst) {
        const { valueLength } = resultAst;

        latestCurrentIndex += valueLength;

        results.push(resultAst);
      } else {
        break;
      }
    }

    return results.length > 0
      ? results.length === 1
        ? // ONE RESULT
          results[0]
        : // MULTIPLE RESULTS
          {
            startIndex: currentIndex,
            endIndex: latestCurrentIndex - 1,
            value: results,
            valueLength: results.reduce((acc, { valueLength: vL }) => acc + vL, 0),
            tokenType: tokenType,
          }
      : // IMPORTANT: This processor is ALWAYS VALID, but it can return an "empty" result.
        // ZERO RESULTS
        {
          startIndex: currentIndex,
          endIndex: currentIndex,
          value: '',
          valueLength: 0,
          tokenType,
        };
  },
  [TokenProcessorOptionTypes.ONE_OR_MORE]: <TokenTypes extends string>(
    syntaxString: string,
    tokenType: TokenTypes,
    tokenValidator: TokenValidator<TokenTypes>,
    grammarMap: BaseGrammarMapType<TokenTypes>,
    currentIndex: number
  ): TokenValidationProcessorReturnValue<TokenTypes> => {
    const results: AST<TokenTypes>[] = [];

    let latestCurrentIndex = currentIndex;

    while (true) {
      const resultAst = processTokenValidator<TokenTypes>(syntaxString, tokenType, tokenValidator, grammarMap, latestCurrentIndex);

      if (resultAst) {
        const { valueLength } = resultAst;

        latestCurrentIndex += valueLength;

        results.push(resultAst);
      } else {
        break;
      }
    }

    return results.length > 0
      ? results.length === 1
        ? // ONE RESULT
          results[0]
        : // MULTIPLE RESULTS
          {
            startIndex: currentIndex,
            endIndex: latestCurrentIndex - 1,
            value: results,
            valueLength: results.reduce((acc, { valueLength: vL }) => acc + vL, 0),
            tokenType: tokenType,
          }
      : // IMPORTANT: This processor is ONLY VALID if there is AT LEAST ONE result.
        // ZERO RESULTS
        false;
  },
  [TokenProcessorOptionTypes.ZERO_OR_ONE]: <TokenTypes extends string>(
    syntaxString: string,
    tokenType: TokenTypes,
    tokenValidator: TokenValidator<TokenTypes>,
    grammarMap: BaseGrammarMapType<TokenTypes>,
    currentIndex: number
  ): TokenValidationProcessorReturnValue<TokenTypes> => {
    let singleResult: AST<TokenTypes> | undefined,
      latestCurrentIndex: number = currentIndex,
      tooManyResults: boolean = false;

    for (let i = 0; i < 2; i++) {
      const resultAst = processTokenValidator<TokenTypes>(syntaxString, tokenType, tokenValidator, grammarMap, latestCurrentIndex);

      if (resultAst) {
        // IMPORTANT: Check for a second result, if it is found, then this processor is invalid.
        if (i === 1) {
          tooManyResults = true;

          break;
        } else {
          const { valueLength } = resultAst;

          latestCurrentIndex += valueLength;

          singleResult = resultAst;
        }
      } else {
        break;
      }
    }

    return !tooManyResults
      ? !singleResult
        ? // ZERO RESULTS
          {
            startIndex: currentIndex,
            endIndex: currentIndex,
            value: '',
            valueLength: 0,
            tokenType,
          }
        : // ONE RESULT
          singleResult
      : // IMPORTANT: This processor is ONLY VALID if there is ONLY ZERO results OR ONLY ONE result.
        // TOO MANY RESULTS (More than 1)
        false;
  },
};

const processTokenValidator: TokenValidationProcessor = <TokenTypes extends string>(
  syntaxString: string = '',
  tokenType: TokenTypes,
  tokenValidator: TokenValidator<TokenTypes>,
  grammarMap: BaseGrammarMapType<TokenTypes>,
  currentIndex: number
): AST<TokenTypes> | false => {
  if (currentIndex >= syntaxString.length - 1) {
    // End Of Input
    return {
      startIndex: currentIndex,
      endIndex: currentIndex,
      value: '',
      valueLength: 0,
      tokenType,
    };
  }

  if (tokenValidator instanceof Array) {
    if (tokenValidator.length > 0) {
      if (tokenValidator[0] === tokenType) {
        // IMPORTANT: Disallow direct recursion.
        return false;
      } else {
        // A combination of types.
        const resultList = [];

        let latestCurrentIndex: number = currentIndex;

        for (const t of tokenValidator) {
          const result = processTokenValidator<TokenTypes>(syntaxString, tokenType, t, grammarMap, latestCurrentIndex);

          if (result) {
            const { valueLength } = result;

            latestCurrentIndex += valueLength;

            resultList.push(result);
          } else {
            // IMPORTANT: There was a MATCH MISS and this combination of token types is INVALID.
            return false;
          }
        }

        return resultList.length === 1
          ? // ONE TOKEN TYPE WITH ONE RESULT
            resultList[0]
          : // MULTIPLE TOKEN TYPES WITH MULTIPLE RESULTS
            {
              startIndex: currentIndex,
              endIndex: latestCurrentIndex - 1,
              value: resultList,
              valueLength: resultList.reduce((acc, { valueLength: vL }) => acc + vL, 0),
              tokenType,
            };
      }
    } else {
      // TRICKY: `tokenValidator` is an empty array, technically a match because "all" validators in the array are NOT `false`, so an "empty" result is returned.
      return {
        startIndex: currentIndex,
        endIndex: currentIndex,
        value: '',
        valueLength: 0,
        tokenType,
      };
    }
  } else if (tokenValidator instanceof RegExp) {
    // RegExp: Direct compare.
    return PROCESS_REGEX<TokenTypes>(syntaxString, tokenType, tokenValidator, grammarMap, currentIndex);
  } else if (tokenValidator instanceof Object) {
    // Use a TokenValidatorOptionProcessor
    const { value: t, option } = tokenValidator;
    const optionProcessor = TOKEN_VALIDATOR_OPTION_PROCESSORS[option];

    return optionProcessor<TokenTypes>(syntaxString, tokenType, t, grammarMap, currentIndex);
  } else {
    // string: Get from map
    const { options = [] } = grammarMap[tokenValidator];
    const reverseOptions = [...options].reverse();

    for (const t of reverseOptions) {
      // TRICKY: Here, the new `tokenType` parameter IS the `tokenValidator`, which is a string.
      const result = processTokenValidator<TokenTypes>(syntaxString, tokenValidator, t, grammarMap, currentIndex);

      if (result) {
        return result;
      }
    }
  }

  return false;
};

export const parseSyntaxString = <TokenTypes extends string>(syntaxString: string = '', grammar: Grammar<TokenTypes>): AST<TokenTypes> | false => {
  const { entry, map } = grammar;

  return processTokenValidator<TokenTypes>(syntaxString, entry, entry, map, 0);
};
