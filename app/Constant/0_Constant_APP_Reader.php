<?php

namespace App\Constant;

use ReflectionClass;

class Constant_APP_Reader
{
    /**
     * ดึงค่า type จาก $field โดยใช้ Reflection เพื่ออ่านค่า d:: จากไฟล์ Constant
     */
    public static function getContract($fieldName): ?string
    {
        echo "Constant_APP_Reader - getContract ====== " . $fieldName . "\n\n";

        // แปลงเป็น UpperCase เพื่อให้ตรงกับชื่อ Const ใน class f
        $constName = strtoupper($fieldName);

        // ใช้ ReflectionClass เข้าไปดึงค่าจาก class f
        $reflection = new \ReflectionClass(\App\Constant\f::class);

        $d_NAME = null;
        if ($reflection->hasConstant($constName)) {
            echo "Found constant: {$constName}\n";

            // ได้ข้อมูล Array ของฟิลด์นั้นมา เช่น ['name', [d::STRING, 255], ...]
            $field_data = $reflection->getConstant($constName);
            $d_NAME = self::get_d_NAME($field_data[1]);
        }

        $type = null;
        if ($d_NAME) {
            $type = match ($d_NAME) {

                'string'  => 'string',

                'integer' => 'int',

                'boolean' => 'bool',

                'decimal' => 'string',

                default => 'int', // for foreign key, default to int
            };
            echo "Mapped d_NAME: {$d_NAME} to type: {$type}\n";
        }
        return "readonly ?{$type} ";
    }

    public static function get_d_NAME($d_Item): ?string
    {
        $d_NAME = null;
        if (is_array($d_Item)) {
            $d_NAME = $d_Item[0];
        } elseif (is_string($d_Item)) {
            $d_NAME = $d_Item;
        }
        if ($d_NAME && str_starts_with($d_NAME, 'd::')) {
            $d_NAME = substr($d_NAME, 3); // cut out 'd::'
        }
        return $d_NAME;
    }
}
