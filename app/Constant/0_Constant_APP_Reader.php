<?php

namespace App\Constant;

use ReflectionClass;

class Constant_APP_Reader
{
    /**
     * get d::NAME from f::CLASS or s::CLASS
     * @param string $fieldname = e.g. 'price' , 'image' etc.
     */
    public static function getContract($fieldname): ?string
    {
        // e.g. 'price' -> 'PRICE'
        $FIELDNAME = strtoupper($fieldname);

        $field_data = null;

        $reflection_F = new \ReflectionClass(\App\Constant\f::class);
        $reflection_S = new \ReflectionClass(\App\Constant\s::class);

        if ($reflection_F->hasConstant($FIELDNAME)) {
            $field_data = $reflection_F->getConstant($FIELDNAME);
        } else if ($reflection_S->hasConstant($FIELDNAME)) {
            $field_data = $reflection_S->getConstant($FIELDNAME);
        } else {
            return null;
        }

        /** somehow getConstant lowercase all content
         field_data = Array
            (
                [0] => confirm_order
                [1] => boolean
                [2] => select
                [3] => Array
                    (
                        [0] => default
                        [1] =>
                    )

            )
         */

        $d_name = self::get_d_name($field_data[1]);

        $type = null;
        if ($d_name) {
            $type = match ($d_name) {

                'string'  => 'string',

                'integer' => 'int',

                'boolean' => 'bool',

                'decimal' => 'string',  //to keep Precision & Rounding , prevent data loss during transfer

                default => 'int', // for foreign key, default to int
            };
        }
        return "readonly ?{$type} ";
    }

    /**
     * Extract the d_name from a field item
     * @param mixed $d_Item = e.g. ['d::DECIMAL', 10, 2] , 'd::BOOLEAN' etc.
     * @return $d_name = e.g. 'decimal', 'boolean' etc.
     */
    public static function get_d_name($d_Item): ?string
    {
        $d_name = null;
        if (is_array($d_Item)) {
            $d_name = $d_Item[0];
        } elseif (is_string($d_Item)) {
            $d_name = $d_Item;
        }
        if ($d_name && str_starts_with($d_name, 'd::')) {
            $d_name = substr($d_name, 3); // cut out 'd::'
        }
        return $d_name;
    }
}
