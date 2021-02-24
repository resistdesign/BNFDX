digit -> [0-9]

command -> [a-zA-Z]

decimal -> "."

digits
    -> digit
    |  digits

value
    -> digits
    |  digits decimal digits
    |  operator digits decimal digits

values
    -> value
    | value values
    | value divider values

command-with-values -> command values

operator
    -> "+"
    |  "-"

divider
    -> ","
    |  " "
