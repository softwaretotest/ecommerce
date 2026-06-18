<?php

namespace App\Constant;

/**
 * FIELD 
 */
class f
{
    public const IMAGE      = ['image',     d::STRING,  u::FILE];
    public const NAME       = ['name',      d::STRING,  u::TEXT,    cud::REQUIRED]; //Base
    public const PRICE      = ['price',     s::CURRENCY];
    public const STOCK      = ['stock',     d::DECIMAL, u::NUMBER,  cd::DEFAULT_NR];
    public const IS_ACTIVE  = ['is_active', d::BOOLEAN, u::SELECT,  cd::DEFAULT_TRUE];
    public const ORDER_NR   = ['order_nr',  d::STRING,  u::TEXT];

    // FOREIGN
    public const ORDER_ID = ['order_id', cd::FOREIGN];
    public const SHOP_ID  = ['shop_id',  cd::FOREIGN];
    public const USER_ID  = ['user_id',  cd::FOREIGN]; //Base
}

/**
 * SPECIAL UI FIELD exist neither in DB nor html-UI
 */
class s
{
    public const EMAIL = ['email', d::STRING,  u::TEXT, cd::UNIQUE];
    public const CURRENCY = ['currency', d::DECIMAL,  u::TEL];
}

/**
 * DB FIELD TYPE
 */
class d
{
    public const BOOLEAN = 'boolean';
    public const STRING = 'string';
    public const INTEGER = 'integer';
    public const DECIMAL = 'decimal';

    // TABLE NAME
    public const users = 'users';
    public const products = 'products';
    public const shops = 'shops';
    public const orders = 'orders';
}


/**
 * UI FIELD TYPE
 */
class u
{
    public const TEXT = 'text';
    public const NUMBER = 'number';
    public const SELECT = 'select';
    public const FILE = 'file';
    public const TEL = 'tel';
}


/**
 * CONSTRAINT DB
 */
class cd
{
    public const NULLABLE = 'nullable';
    public const DEFAULT_NR = ['default', 0];
    public const DEFAULT_TRUE = ['default', true];
    public const PRIMARY = 'primary';
    public const FOREIGN = 'foreign';
    public const UNIQUE = 'unique';
    public const INDEX = 'index';
}

/**
 * CONSTRAINT UI 
 */
class cu
{
    public const READONLY = 'readonly';
    public const DISABLED = 'disabled';
}

/**
 * CONSTRAINT UI and DB
 */
class cud
{
    public const REQUIRED = 'required';
}

abstract class BaseConstant
{
    // POSITION AUF DB or UI TYPE in $map
    public const DB_MAP_POSITION = 0; // 0 = key position
    public const UI_MAP_POSITION = 1; // 1 = value position

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
