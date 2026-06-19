<?php

namespace App\Constant;

class Checker
{
    public static function checkDuplicate(): void
    {
        $classes = ['f', 's', 'd', 'u', 'cd', 'cu', 'cud', 't'];
        $sameFields = [];
        $errors = [];

        foreach ($classes as $className) {
            $fullClassName = 'App\\Constant\\' . $className;
            if (!class_exists($fullClassName)) continue;

            $errors = array_merge($errors, self::validateConstant($fullClassName, $sameFields));
        }

        self::reportErrors($errors);
    }

    private static function validateConstant(string $fullClassName, array $samefields): array
    {
        $localErrors = [];
        $constants = (new \ReflectionClass($fullClassName))->getConstants();

        foreach ($constants as $varname => $field) {
            $field = is_array($field) ? $field : [$field];
            $source = "{$fullClassName}::{$varname}";

            // 1. check field name
            if (!isset($field[0])) {
                $localErrors[] = "[Field Name] Missing name definition in [{$source}]";
            }

            $name = $field[0] ?? 'UNKNOWN';

            // 2. check duplicate field name
            if (isset($samefields[$name])) {
                $localErrors[] = "[Field Name] Duplicate '{$name}' found in [{$samefields[$name]}] and [{$source}]";
            }
            $samefields[$name] = $source;

            // 3. check duplicate constraints
            $localErrors = array_merge($localErrors, self::checkConstraints(array_slice($field, 1), $source));
        }
        return $localErrors;
    }
    private static function checkConstraints($constraints, $source): array
    {
        if (count($constraints) <= 1) {
            return [];
        }

        $constraintErrors = [];
        $sameConstraints = [];

        foreach ($constraints as $c) {
            /**
             * get constraint name
             * cause some are string,
             * but, some are array e.g. ['default_nr', 0]
             */
            $cName = is_array($c) ? $c[0] : $c;

            // ตรวจสอบว่าเคยเจอ $cName นี้มาก่อนในลูปเดียวกันนี้หรือไม่
            if (isset($sameConstraints[$cName])) {
                // ใส่ Error ตาม Format ที่คุณกำหนด
                $constraintErrors[] = "[Constraint] Duplicate '{$cName}' found in field at [{$source}]";
            }

            // บันทึกว่าเจอแล้ว
            $sameConstraints[$cName] = true;
        }

        return $constraintErrors;
    }

    private static function reportErrors(array $errors): void
    {
        if (!empty($errors)) {
            echo "\n[ALERT] SYSTEM VALIDATION FAILED!\n" . implode("\n", $errors) . "\n\n";
        } else {
            echo "--- Maker: Global Validator Passed! ---\n\n";
        }
    }
}
