<?php

namespace App\Constant;

class M_Sync_JSON_Entities
{
    public static function generate(): void
    {
        $jsonFilePath = __DIR__ . '/M_JSON/Entities.json';
        if (!file_exists($jsonFilePath)) {
            echo "[ 🚫 ERROR] Entities.json not found.\n";
            return;
        }

        $json = json_decode(file_get_contents($jsonFilePath), true);
        if (!isset($json['entities']) || !is_array($json['entities'])) {
            echo "[ 🚫 ERROR] Invalid entities JSON structure.\n";
            return;
        }

        // Loop Entity in JSON (e.g. ORDERS, PRODUCTS, etc.)
        foreach ($json['entities'] as $entityName => $fields) {
            // change ENTITIES to Singular and make Capitalization (e.g. ORDERS -> Order)
            $singularName = rtrim($entityName, 'S');
            $className = ucfirst(strtolower($singularName)) . 'Constant';
            $fileName = $className . '.php';

            $code = "<?php\n\nnamespace App\Constant;\n\n";
            $code .= "class {$className}\n{\n";
            $code .= "    public const TABLE_NAME = t::{$entityName};\n\n";
            $code .= "    public static function fields(): array\n    {\n";
            $code .= "        return [\n";

            foreach ($fields as $field) {
                // if in JSON written in string e.g "f::ORDER_NR" , then comma at the end if it
                $code .= "            {$field},\n";
            }

            $code .= "        ];\n";
            $code .= "    }\n";
            $code .= "}\n";

            // save Entity into folder app/Constant
            file_put_contents(__DIR__ . '/Entities/' . $fileName, $code);
            echo "[ ✅ ] {$fileName} generated successfully.\n";
        }
    }

    private static function formatArray($arr): string
    {
        if (!is_array($arr)) {
            if (is_string($arr) && preg_match('/^[a-z]+::[A-Z_]+$/', $arr)) {
                return $arr;
            }
            return var_export($arr, true);
        }
        $items = [];
        foreach ($arr as $val) {
            $items[] = self::formatArray($val);
        }
        return '[' . implode(', ', $items) . ']';
    }
}
