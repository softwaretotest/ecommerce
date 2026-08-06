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

        foreach (glob(__DIR__ . '/Entities/*Constant.php') as $file) {
            if (str_contains($file, 'Entities_to_JSON')) continue;

            $code = file_get_contents($file);
            $ast = $parser->parse($code);
            $traverser = new NodeTraverser();
            $traverser->addVisitor($scanner);
            $traverser->traverse($ast);
        }

        $outputData = ["_comment" => $jsonFile, "entities" => $scanner->entities];
        file_put_contents(__DIR__ . '/' . $jsonFile, json_encode($outputData, JSON_PRETTY_PRINT));
        echo "--- M_Sync: Created {$jsonFile} ---\n";
    }
}

// Trigger sync
\App\Constant\M_Sync::syncAll();
