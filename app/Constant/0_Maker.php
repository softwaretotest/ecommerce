<?php

namespace App\Constant;
//0_Maker.php

class Maker
{
    public static function run(string $className): void
    {
        if (!class_exists($className)) {
            echo "Class {$className} not found!\n";
            return;
        }

        // คืนค่าให้เป็นของจริงเท่านั้น ไม่ต้องมี array_merge กับ Test Fields แล้ว
        $fields = $className::fields();

        echo "--- Maker: Analyzing {$className} ---\n";
        echo "Table: " . $className::TABLE_NAME . "\n";

        foreach ($fields as $field) {
            $name = array_shift($field);
            self::analyzeField($name, $field);
        }
        echo "--------------------------------------\n";
    }

    private static function analyzeField(string $name, array $field): void
    {
        // ... (Logic เดิมของคุณเป๊ะๆ)
        $result = ['db' => [], 'ui' => []];
        $map = [
            'd' => ['db' => true],
            'u' => ['ui' => true],
            'cd' => ['db' => true],
            'cu' => ['ui' => true],
            'cud' => ['db' => true, 'ui' => true],
            's' => ['db' => true, 'ui' => true]
        ];

        foreach ($field as $item) {
            $val = is_array($item) ? $item[0] : $item;
            foreach ($map as $key => $targets) {
                $ref = new \ReflectionClass("App\\Constant\\" . strtoupper($key));
                if (in_array($val, array_values($ref->getConstants()))) {
                    if ($targets['db'] ?? false) $result['db'][] = $val;
                    if ($targets['ui'] ?? false) $result['ui'][] = $val;
                }
            }
            if ($val === 'default_nr' || $val === 'default_true') $result['db'][] = $item;
        }

        echo "Field: " . str_pad($name, 20) .
            " | DB: " . json_encode($result['db']) .
            " | UI: " . json_encode($result['ui']) . "\n";
    }
}
