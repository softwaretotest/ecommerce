<?php
// app/Geners/test_scan.php

require_once __DIR__ . '/../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Constant\f;

$directory = app_path('Constant');
$files = glob($directory . '/*.php');

echo "--- Start Scanning Entities ---\n";

foreach ($files as $file) {
    $fileName = basename($file);

    // filter: filename ends with 'Constant.php' and does not start with a number
    if (!str_ends_with($fileName, 'Constant.php') || is_numeric($fileName[0])) {
        continue;
    }

    $className = basename($file, '.php');
    $fullClassName = "App\\Constant\\" . $className; // ปรับ Namespace ให้ตรงกับตำแหน่งปัจจุบัน

    echo "  - Full Class Name: {$fullClassName}\n";

    if (class_exists($fullClassName)) {

        echo "  - Class Found: {$fullClassName}\n";

        $tableName = $fullClassName::TABLE_NAME;
        $fields = $fullClassName::fields();
        $entityName = str_replace('Constant', '', $className);

        echo "\n[Entity]: {$entityName}\n";
        echo "  - Table: {$tableName}\n";
        echo "  - Fields Found: " . count($fields) . "\n";

        foreach ($fields as $field) {
            // check if it's a Foreign Key
            $isForeign = in_array('cd::FOREIGN', $field, true) || in_array(\App\Constant\cd::FOREIGN, $field, true);
            $fieldName = $field[0];
            echo "    * {$fieldName} " . ($isForeign ? "[FOREIGN KEY]" : "") . "\n";
        }
    }
}
echo "\n--- Scanning Complete ---\n";
