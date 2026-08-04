<?php

namespace App\Constant;

require __DIR__ . '/../../vendor/autoload.php';

use PhpParser\ParserFactory;
use PhpParser\NodeTraverser;


/**
 * sync JSON to PHP
 */
class M_Sync_JSON
{
    const M_JSON = '/M_JSON';

    public static function syncAll(): void
    {
        // Generate M-Data and App-Data
        self::run_JSON_to_PHP('0_Constant_M.php', self::M_JSON . '/M-Data.json');
        self::run_JSON_to_PHP('0_Constant_APP.php', self::M_JSON . '/App-Data.json');

        // Generate Entities data
        self::run_JSON_to_Entities(self::M_JSON . '/Entities.json');
    }

    /**
     * 1. check if $sourceFile exist
     * 2. create folder ./history if not exist
     * 3. rename $sourceFile = unixtimestamp() + "_" + $sourceFile
     * 4. move $sourceFile to folder ./history
     * @param $sourceFile = e.g. M-Data.json
     */
    private static function move_old_file_to_history($sourceFile)
    {
        // 1. create folder ./history if not exist

        // 2. check if $sourceFile exist

        // 3. rename $sourceFile = unixtimestamp() + "_" + $sourceFile

        // 4. move $sourceFile to folder ./history

    }

    /**
     * 1. get a List of Entities from $jsonFile 
     * 2. Loop Entities : (USERS,PRODUCTS,ORDERS,etc.)
     * * 2.1 check if PHP file of each Entitiy exists , e.g. UserConstant.php 
     * * 2.2 if file exist rename e.g. UserConstant.php to unixtimestamp() + "_" + UserConstant.php
     * * 2.3 move php file to ./history
     * @param $jsonFile = Entities.json
     */
    private static function move_old_Entities_to_history($jsonFile) {}

    private static function run_JSON_to_PHP($sourceFile, $jsonFile): void
    {
        M_Sync_JSON::move_old_file_to_history($sourceFile);

        // // กำหนด Path เต็มสำหรับโฟลเดอร์ M_JSON
        // $directory = __DIR__ . self::M_JSON;

        // // เช็คว่ามีโฟลเดอร์ไหม ถ้าไม่มีให้สร้าง
        // if (!file_exists($directory)) {
        //     mkdir($directory, 0755, true);
        // }

        // $parser = (new ParserFactory)->createForNewestSupportedVersion();
        // $code = file_get_contents(__DIR__ . '/' . $sourceFile);
        // $ast = $parser->parse($code);

        // $visitor = new Constant_M_APP_to_JSON();
        // $traverser = new NodeTraverser();
        // $traverser->addVisitor($visitor);
        // $traverser->traverse($ast);

        // $outputData = array_merge(["_comment" => $jsonFile], $visitor->data);
        // file_put_contents(__DIR__ . '/' . $jsonFile, json_encode($outputData, JSON_PRETTY_PRINT));
        // echo "--- M_Sync: Created {$jsonFile} ---\n";
    }

    private static function run_JSON_to_Entities($jsonFile): void
    {
        M_Sync_JSON::move_old_Entities_to_history($jsonFile);

        // $parser = (new ParserFactory)->createForNewestSupportedVersion();
        // $scanner = new Entities_to_JSON();

        // foreach (glob(__DIR__ . '/*Constant.php') as $file) {
        //     if (str_contains($file, 'Entities_to_JSON')) continue;

        //     $code = file_get_contents($file);
        //     $ast = $parser->parse($code);
        //     $traverser = new NodeTraverser();
        //     $traverser->addVisitor($scanner);
        //     $traverser->traverse($ast);
        // }

        // $outputData = ["_comment" => $jsonFile, "entities" => $scanner->entities];
        // file_put_contents(__DIR__ . '/' . $jsonFile, json_encode($outputData, JSON_PRETTY_PRINT));
        // echo "--- M_Sync: Created {$jsonFile} ---\n";
    }
}

// Trigger sync
\App\Constant\M_Sync_JSON::syncAll();
