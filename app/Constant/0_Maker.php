<?php

namespace App\Constant;
//0_Maker.php

class Maker
{
    public static function run(string $className): void
    {
        $schema = [];
        if (!Checker::checkDuplicate()) {
            echo "--- Maker: Aborted due to validation errors! ---\n";
            return;
        }

        $tableName = self::checkTableName($className);
        if (!$tableName) return;

        if (!class_exists($className)) {
            echo "Class {$className} not found!\n";
            return;
        }

        $fields = $className::fields();

        echo "--- Maker: Analyzing {$className} ---\n";
        echo "Table: " . $className::TABLE_NAME . "\n";

        foreach ($fields as $field) {
            $name = array_shift($field);
            $schema[$name] = self::analyzeField($name, $field);
        }
        echo "--------------------------------------\n";

        if (empty($schema)) {
            echo "Error: No fields defined or analysis failed in [{$className}].\n";
            return;
        }

        MakeMigration::run($tableName, $schema);
    }

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
    private static function analyzeField(string $name, array $field): array
    {
        // ... (Logic เดิมของคุณเป๊ะๆ)
        $schema = ['db' => [], 'ui' => []];
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
                    if ($targets['db'] ?? false) $schema['db'][] = $val;
                    if ($targets['ui'] ?? false) $schema['ui'][] = $val;
                }
            }
            if ($val === 'default_nr' || $val === 'default_true') $schema['db'][] = $item;
        }

        echo "Field: " . str_pad($name, 20) .
            " | DB: " . json_encode($schema['db']) .
            " | UI: " . json_encode($schema['ui']) . "\n";

        return $schema;
    }

    private static function checkTableName(string $className): ?string
    {
        if (!class_exists($className)) {
            echo "Error: Class {$className} does not exist.\n";
            return null;
        }

        $reflection = new \ReflectionClass($className);

        if (!$reflection->hasConstant('TABLE_NAME')) {
            echo "Error: {$className} is missing 'TABLE_NAME' constant.\n";
            return null;
        }

        $tableName = $className::TABLE_NAME;
        if (empty($tableName)) {
            echo "Error: 'TABLE_NAME' in {$className} cannot be empty.\n";
            return null;
        }

        return $tableName;
    }
}
