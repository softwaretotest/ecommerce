<?php

namespace App\Constant;

require __DIR__ . '/../../vendor/autoload.php';

use PhpParser\ParserFactory;
use PhpParser\NodeTraverser;

/**
 * sync PHP to JSON
 */
class M_Sync
{
    const M_JSON = '/M_JSON';

    public static function syncAll(): void
    {
        // Generate M-Data and App-Data
        self::run_PHP_to_JSON('0_Constant_M.php', self::M_JSON . '/M-Data.json');
        self::run_PHP_to_JSON('0_Constant_APP.php', self::M_JSON . '/App-Data.json');

        // Generate Entities data
        self::run_Entities_to_JSON(self::M_JSON . '/Entities.json');
    }

    private static function run_PHP_to_JSON($sourceFile, $jsonFile): void
    {
        // กำหนด Path เต็มสำหรับโฟลเดอร์ M_JSON
        $directory = __DIR__ . self::M_JSON;

        // เช็คว่ามีโฟลเดอร์ไหม ถ้าไม่มีให้สร้าง
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $parser = (new ParserFactory)->createForNewestSupportedVersion();
        $code = file_get_contents(__DIR__ . '/' . $sourceFile);
        $ast = $parser->parse($code);

        $visitor = new Constant_M_APP_to_JSON();
        $traverser = new NodeTraverser();
        $traverser->addVisitor($visitor);
        $traverser->traverse($ast);

        $outputData = array_merge(["_comment" => $jsonFile], $visitor->data);
        file_put_contents(__DIR__ . '/' . $jsonFile, json_encode($outputData, JSON_PRETTY_PRINT));
        echo "--- M_Sync: Created {$jsonFile} ---\n";
    }

    private static function run_Entities_to_JSON($jsonFile): void
    {
        $parser = (new ParserFactory)->createForNewestSupportedVersion();
        $scanner = new Entities_to_JSON();

        // 1. สแกนหาข้อมูลสดๆ จากไฟล์ PHP Constants ทั้งหมดเก็บไว้ใน $php_entities
        foreach (glob(__DIR__ . '/Entities/*Constant.php') as $file) {
            if (str_contains($file, 'Entities_to_JSON')) continue;

            $code = file_get_contents($file);
            $ast = $parser->parse($code);
            $traverser = new NodeTraverser();
            $traverser->addVisitor($scanner);
            $traverser->traverse($ast);
        }

        // ตัวแปรข้อมูลดิบที่ได้จาก PHP สแกนมา
        $php_entities = $scanner->entities;
        $final_entities = [];

        // กำหนด Path เต็มของไฟล์ JSON เป้าหมาย
        $jsonFilePath = __DIR__ . '/' . $jsonFile;

        // 2. ตรวจสอบว่ามีไฟล์ JSON เก่าอยู่แล้วหรือไม่ เพื่อใช้เป็น Master Order
        if (file_exists($jsonFilePath)) {
            $json_data = json_decode(file_get_contents($jsonFilePath), true);
            $json_entities = $json_data['entities'] ?? [];

            // Case 1 & Case 3: วิ่งตาม "Master Order" จาก JSON เก่า
            foreach ($json_entities as $table_name => $fields) {
                if (isset($php_entities[$table_name])) {
                    // ตารางยังมีอยู่ -> ยึดลำดับเดิม แต่เอา Fields ใหม่จาก PHP มาทับ
                    $final_entities[$table_name] = $php_entities[$table_name];
                    unset($php_entities[$table_name]); // Mark ว่าจัดการแล้ว
                }
                // ถ้าตารางไหนถูกลบจาก PHP ไปแล้ว ลูปนี้จะข้ามไปเองอัตโนมัติ (Case 3)
            }

            // Case 2: ตารางไหนที่เหลืออยู่ใน $php_entities แสดงว่าเป็น "ตารางใหม่"
            if (!empty($php_entities)) {
                foreach ($php_entities as $new_table_name => $new_fields) {
                    // นำตารางใหม่ไปต่อท้ายสุด
                    $final_entities[$new_table_name] = $new_fields;
                }
            }
        } else {
            // ถ้ายังไม่เคยมีไฟล์ JSON เลย ให้ใช้ลำดับจาก PHP ไปก่อนรอบแรก
            $final_entities = $php_entities;
        }

        // 3. บันทึกผลลัพธ์ลงไฟล์ JSON โดยรักษา Master Order ฝั่ง UI ไว้สมบูรณ์
        $outputData = ["_comment" => $jsonFile, "entities" => $final_entities];
        file_put_contents($jsonFilePath, json_encode($outputData, JSON_PRETTY_PRINT));
        echo "--- M_Sync: Created {$jsonFile} ---\n";
    }

    // private static function run_Entities_to_JSON($jsonFile): void
    // {
    //     $parser = (new ParserFactory)->createForNewestSupportedVersion();
    //     $scanner = new Entities_to_JSON();

    //     foreach (glob(__DIR__ . '/Entities/*Constant.php') as $file) {
    //         if (str_contains($file, 'Entities_to_JSON')) continue;

    //         $code = file_get_contents($file);
    //         $ast = $parser->parse($code);
    //         $traverser = new NodeTraverser();
    //         $traverser->addVisitor($scanner);
    //         $traverser->traverse($ast);
    //     }

    //     $outputData = ["_comment" => $jsonFile, "entities" => $scanner->entities];
    //     file_put_contents(__DIR__ . '/' . $jsonFile, json_encode($outputData, JSON_PRETTY_PRINT));
    //     echo "--- M_Sync: Created {$jsonFile} ---\n";
    // }
}

// Trigger sync
\App\Constant\M_Sync::syncAll();
