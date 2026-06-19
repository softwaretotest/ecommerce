<?php

namespace App\Constant;
//0_Maker.php

class Maker
{
    public static function checkDuplicate(): void
    {
        $allFields = [];
        $errors = [];

        $targetFile = __DIR__ . '/0_MakerConstant.php';

        if (!file_exists($targetFile)) {
            die("[ERROR] Target file 0_MakerConstant.php not found!\n");
        }

        $classesToInspect = ['f', 's', 'd', 'u', 'cd', 'cu', 'cud'];

        foreach ($classesToInspect as $className) {
            $fullClassName = 'App\\Constant\\' . $className;

            if (!class_exists($fullClassName)) continue;

            $ref = new \ReflectionClass($fullClassName);
            foreach ($ref->getConstants() as $key => $config) {
                if (is_array($config)) {
                    $fieldName = $config[0];

                    if (isset($allFields[$fieldName])) {
                        $errors[] = "Duplicate '{$fieldName}' found in [{$allFields[$fieldName]}] AND [{$fullClassName}::{$key}]";
                    } else {
                        $allFields[$fieldName] = "{$fullClassName}::{$key}";
                    }
                }
            }
        }

        if (!empty($errors)) {
            die("\n[ALERT] DUPLICATE FIELDS DETECTED!\n" . implode("\n", $errors) . "\n");
        }

        echo "--- Maker: All fields in 0_MakerConstant are unique. Check passed! ---\n";
    }

    public static function run(string $className): void
    {
        if (!class_exists($className)) {
            echo "Class {$className} not found!\n";
            return;
        }

        $fields = $className::fields();
        echo "--- Maker: Analyzing {$className} ---\n";
        echo "Table: " . $className::TABLE_NAME . "\n";

        foreach ($fields as $field) {
            $name = array_shift($field);
            self::analyzeField($name, $field);
        }
        echo "--------------------------------------\n";
    }

    private static function analyzeField(string $name, array $config): void
    {
        $result = ['db' => [], 'ui' => []];
        $map = [
            'd'   => ['db' => true],
            'u'   => ['ui' => true],
            'cd'  => ['db' => true],
            'cu'  => ['ui' => true],
            'cud' => ['db' => true, 'ui' => true],
            's'   => ['db' => true, 'ui' => true],
        ];

        foreach ($config as $item) {
            $val = is_array($item) ? $item[0] : $item;

            foreach ($map as $className => $targets) {
                $ref = new \ReflectionClass("App\\Constant\\" . strtoupper($className));
                if (in_array($val, array_values($ref->getConstants()))) {
                    if ($targets['db'] ?? false) $result['db'][] = $val;
                    if ($targets['ui'] ?? false) $result['ui'][] = $val;
                }
            }

            if ($val === 'default') {
                $result['db'][] = $item;
            }
        }

        echo "Field: " . str_pad($name, 20) .
            " | DB: " . json_encode($result['db']) .
            " | UI: " . json_encode($result['ui']) . "\n";
    }
}
