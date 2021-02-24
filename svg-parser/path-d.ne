input -> commands

digit -> [0-9]

commandName -> [a-zA-Z]

decimal -> "."

digits
    -> digit
    |  digits

value
    -> digits
    |  decimal digits
    |  digits decimal digits
    |  operator digits decimal digits

values
    -> value
    | value values
    | value divider values

command
    -> commandName values
    |  commandName _ values

commands
    -> command
    | command commands

operator
    -> "+"
    |  "-"

divider
    -> ","
    |  _

_ -> [ \t]:*
