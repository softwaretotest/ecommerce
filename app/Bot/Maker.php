<?php

namespace App\Bot;

use ReflectionClass;

class Maker
{
    /**
     * Read and display fields from the given class
     */
    // app/Bot/Maker.php

    public static function run(string $className): void
    {
        // ... ตรวจสอบ class_exists เหมือนเดิม ...

        // แทนที่จะไปดึง childFields ตรงๆ ให้เรียก fields() 
        // เพราะ fields() คือจุดที่รวม Base + Child ไว้แล้ว
        $fields = $className::fields();

        echo "--- Maker: Analyzing {$className} ---\n";
        echo "Table: " . $className::TABLE_NAME . "\n";

        foreach ($fields as $field) {
            // ใช้ชื่อ field ที่ตำแหน่ง 0 เสมอ
            $name = $field[0];
            // ใช้ implode หรือ json_encode เพื่อกัน Array to string conversion
            $config = json_encode(array_slice($field, 1));

            echo "Field: " . str_pad($name, 15) . " | Config: {$config}\n";
        }
        echo "--------------------------------------\n";
    }
}
