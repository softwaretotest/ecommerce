<?php

namespace App\Constant;
//0_MakeSchema.php

class MakeSchema
{
    /**
     * Example $schema =
                Array
                (
                    [db] => Array
                        (
                            [0] => unique
                            [1] => decimal
                            [2] => default_nr
                        )
                    [ui] => Array
                        (
                            [0] => default_true
                        )
                )
     */
    public static function separate_db_ui(string $name, array $field): array
    {
        $schema = ['db' => [], 'ui' => []];

        //d_u_cd_cu_cud are classes in MakerConstant.php
        $map_d_u_cd_cu_cud = [
            'd' => ['db' => true],
            'u' => ['ui' => true],
            'cd' => ['db' => true],
            'cu' => ['ui' => true],
            'cud' => ['db' => true, 'ui' => true]
        ];

        foreach ($field as $item) {
            $val = is_array($item) ? $item[0] : $item;
            if (SpecialField::successfully_added($item, $schema)) {
                continue;
            }

            /**
             * this is_array to fix duplicates e.g.
             * DB: ["foreign","foreign"]
             * DB: ["decimal","default","default",["default",0]]
             * DB: ["decimal","default","default",["default",0],"required"]
             */
            if (is_array($item)) {
                $schema['db'][] = $item;
                continue; // skip loop avoid duplicates
            }

            foreach ($map_d_u_cd_cu_cud as $key => $targets) {
                $ref = new \ReflectionClass("App\\Constant\\" . strtoupper($key));
                if (in_array($val, array_values($ref->getConstants()))) {
                    if ($targets['db'] ?? false) $schema['db'][] = $val;
                    if ($targets['ui'] ?? false) $schema['ui'][] = $val;
                }
            }
            if (is_array($item) && strpos($item[0], 'default') !== false) {
                $schema['db'][] = $item;
            }
        }

        /**
         * 25 = width of culumn
        Field: user_id                  DB: ["foreign","foreign"]
        Field: name                     DB: ["string","required"]
        Field: shop_id                  DB: ["foreign","foreign"]
         */
        $padName = str_pad($name, 25);
        echo "Field: {$padName} DB: " . json_encode($schema['db']) . "\n\n";
        echo "Field: {$padName} UI: " . json_encode($schema['ui']) . "\n\n";
        echo "-----------------------------------------------------\n\n";
        // ----------------------------------------------------

        return $schema;
    }
}
