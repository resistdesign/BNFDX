input -> optional_white_space commands optional_white_space

white_space -> [ \t\n]

divider
    -> ","
    |  white_space:+

optional_white_space -> white_space:*

digit -> [0-9]

digits -> digit:+

decimal -> "."

operator
    -> "+"
    |  "-"

value
    -> digits
    |  decimal digits
    |  digits decimal digits
    |  operator digits
    |  operator decimal digits
    |  operator digits decimal digits

values
    -> value
    | value values
    | value divider values

commandName -> [a-zA-Z]

command
    -> commandName values
    |  commandName optional_white_space values

commands
    -> command
    |  command commands
    |  command optional_white_space commands

# TODO: Add transformers!
