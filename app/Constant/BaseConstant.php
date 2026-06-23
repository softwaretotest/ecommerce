<?php

namespace App\Constant;

abstract class BaseConstant
{
    private static array $baseFields = [
        f::USER_ID,
        f::NAME,
        f::IMAGE,
    ];

    public static function fields(): array
    {
        if (!defined('static::TABLE_NAME')) {
            throw new \Exception("Class " . static::class
                . " must define public const TABLE_NAME!");
        }

        /**
         * make associative array from baseFields 
         * for easier key access
         */
        $fields = [];
        foreach (self::$baseFields as $field) {
            $fields[$field[0]] = $field;
        }

        $tableName = static::TABLE_NAME;

        if ($tableName === t::users) {
            unset($fields['user_id']);
        }

        if ($tableName === t::orders) {
            unset($fields['image']);
            unset($fields['name']);
        }

        // 3. รวมกับ childFields
        $childFields = static::childFields();
        foreach ($childFields as $field) {
            $fields[$field[0]] = $field;
        }

        // 4. คืนค่าเป็น Indexed Array เพื่อให้โครงสร้างเดิมใช้งานได้
        return array_values($fields);
    }

    abstract protected static function childFields(): array;
}
