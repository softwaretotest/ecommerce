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
            throw new \Exception("Class " . static::class . " must define public const TABLE_NAME!");
        }

        // 1. แปลง $baseFields ให้เป็น Associative Array โดยใช้ชื่อฟิลด์ (index 0) เป็น Key
        $fields = [];
        foreach (self::$baseFields as $field) {
            $fields[$field[0]] = $field;
        }

        $tableName = static::TABLE_NAME;

        // 2. ตอนนี้เราสามารถ unset ด้วยชื่อฟิลด์ได้แล้ว!
        if ($tableName === d::users) {
            unset($fields['user_id']); // ใช้ชื่อคีย์ที่เป็น String
        }

        if ($tableName === d::orders) {
            unset($fields['image']);
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
