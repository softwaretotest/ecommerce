<?php

namespace App\Constant;
//0_SpecialField.php

class SpecialField
{
    /**
     * Checks if a field is a special 
     * and handle field specially
     * We use first element of array for name,
     * because it our Bot convention e.g.
     * s::EMAIL[0]
     * s::CURRENCY[0]
     */
    public static function successfully_added($item, &$schema): bool
    {
        $isSpecial = false;
        $fieldName = is_array($item) ? $item[0] : $item;
        if ($fieldName === s::EMAIL[0]) {
            echo $fieldName . " DB UI field, SPECIAL.\n";
            $schema['db'][] = $item;
            $schema['ui'][] = $item;
            $isSpecial = true;
        }

        if ($fieldName === s::CURRENCY[0]) {
            echo $fieldName . " UI field, SPECIAL\n";
            $schema['ui'][] = $item;
            $isSpecial = true;
        }

        /**
         * check if the field is a special field and add it to the schema if it is.
         */
        // $msg = "Checking if '{$fieldName}' ";
        // $special_text = $isSpecial ? " IS YES" : " IS NOT";
        // $msg .= $special_text . " a special field.\n";
        // echo $msg;

        return $isSpecial;
    }
}
