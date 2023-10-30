![BNFDX](./src/Assets/ID/BNFDX%20Logo%202023.png)

A BNF like parser that uses an object structure as input and includes transformation features.

## Installation

```bash
yarn add bnfdx
```

## Additional Information

[What is BNF?](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)

## TODO

### Error Handling

**Syntax Errors:**

Unexpected Token: When a token is encountered that doesn't fit the expected grammar.
Missing Token: When an expected token is not found.
End-of-Input: When the parser reaches the end of the input but hasn't resolved all grammatical structures.

**Semantic Errors:**

Invalid Token Value: When a token's value is invalid (e.g., an out-of-range number).
Undefined Reference: When a token refers to something that hasn't been defined.
Duplicate Definition: When a token is defined more than once in a context where that's not allowed.

**Recursion Errors:**

Infinite Loop: When the parser is stuck in a loop due to recursive rules with no exit condition.
Recursion Depth Exceeded: When the parser exceeds a predefined limit of recursive calls.

**Resource Errors:**

Memory Limit Exceeded: When the parser uses more memory than it's allowed to.
Time Limit Exceeded: When the parser takes too long to complete.

**Configuration Errors:**

Invalid Grammar: When the provided grammar has issues like undefined tokens, circular references, etc.
Missing Grammar: When no grammar is provided but is required.

**Custom Logic Errors:**

Custom Validation Failed: If you have any custom validation rules or hooks, report when they fail.

**Environmental Errors:**

File Not Found: If the parser reads from a file and it's not found.
IO Error: Errors related to reading the input or writing the output.
Miscellaneous:
Internal Error: For anything that's clearly a bug in the parser.
Warning: For non-fatal issues that the user should be aware of.
Bonus: Enhancements
Error Location: Show where in the input the error occurred, if applicable.
Suggestion: Suggest potential fixes or next steps for common errors.
