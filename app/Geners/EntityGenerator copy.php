<?php

namespace App\Geners;

// เปลี่ยนฟังก์ชันเป็นชื่อนี้
function gen_path($path = '')
{
    return dirname(__DIR__, 2) . '/app/' . ltrim($path, '/');
}


class EntityGenerator
{
    public static function runAll()
    {
        $directory = dirname(__DIR__, 2) . '/app/Constant';
        // กรองเอาเฉพาะไฟล์ที่ลงท้ายด้วย Constant.php
        $files = glob($directory . '/*Constant.php');

        foreach ($files as $file) {
            $className = basename($file, '.php');
            // เปลี่ยน Namespace ให้ตรงกับที่ไฟล์นั้นอยู่จริงๆ
            $fullClassName = "App\\Constant\\" . $className;

            if (class_exists($fullClassName)) {
                // เช็คก่อนว่ามีเมธอด fields() จริงไหม เพื่อป้องกัน Error
                if (method_exists($fullClassName, 'fields')) {
                    $tableName = $fullClassName::TABLE_NAME;
                    $fields = $fullClassName::fields();
                    $entityName = str_replace('Constant', '', $className);

                    echo "Generating: {$entityName} (Table: {$tableName})\n";
                    self::generate($entityName, $fields);
                }
            }
        }

        echo "Generated successfully!";
    }

    public static function generate($entityName, $fields)
    {
        // 1. Generate Model
        self::generateModel($entityName, $fields);

        // 2. Generate DTO
        self::generateDTO($entityName, $fields);
    }

    private static function generateModel($entityName, $fields)
    {
        $stub = file_get_contents(gen_path('Geners/Stub/model.stub'));
        $methods = "";

        foreach ($fields as $field) {
            // if it's a Foreign Key , then let gen Method Relation
            if (is_array($field) && in_array(\App\Constant\cd::FOREIGN, $field)) {

                echo "  - Generating relation method for foreign key: {$field[0]}\n";

                $relationName = str_replace('_id', '', $field[0]);
                $relatedClass = ucfirst($relationName);
                $methods .= "\n    public function {$relationName}(): \Illuminate\Database\Eloquent\Relations\BelongsTo\n    {\n";
                $methods .= "        return \$this->belongsTo(\App\Models\\{$relatedClass}::class);\n    }\n";
            }
        }

        $output = str_replace('class Dummy', "class {$entityName}", $stub);
        $output = str_replace('}', $methods . "\n}", $output);

        file_put_contents(gen_path("Models/{$entityName}.php"), $output);
    }

    private static function generateDTO($entityName, $fields)
    {
        $stub = file_get_contents(gen_path('Geners/Stub/dto.stub'));
        $properties = "";
        $arrayMapping = "";

        $is_first_line = true;
        foreach ($fields as $field) {
            $name = is_array($field) ? $field[0] : $field;

            // สำหรับ Properties: ใส่ย่อหน้า 4 spaces เสมอ
            if ($is_first_line) {
                $properties .= "public \${$name} = null;\n";
                $arrayMapping .= "'{$name}' => \$data['{$name}'] ?? null,\n";
            } else {
                $properties .= "    public \${$name} = null;\n";
                $arrayMapping .= "            '{$name}' => \$data['{$name}'] ?? null,\n";
            }

            $is_first_line = false;
        }


        // replace DummyDTO with actual entity name
        $output = str_replace('DummyDTO', "{$entityName}DTO", $stub);

        // REPLACE PROPERTIES AND MAPPING
        $output = str_replace('//PROPERTIES', $properties, $output);
        $output = str_replace('//MAPPING', $arrayMapping, $output);

        file_put_contents(gen_path("DTOs/{$entityName}DTO.php"), $output);
    }
}
