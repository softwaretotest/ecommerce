<?php

namespace App\Constant;

require __DIR__ . '/../../vendor/autoload.php';

use PhpParser\ParserFactory;
use PhpParser\NodeTraverser;

class MSync
{
    public static function syncAll(): void
    {
        // Generate M-Data and App-Data
        self::runPHPToJSON('0_Constant_M.php', '1_M-Data.json');
        self::runPHPToJSON('0_Constant_APP.php', '1_App-Data.json');

        // Generate Entities data
        self::runEntitiesSync();
    }

    private static function runPHPToJSON($sourceFile, $jsonFile): void
    {
        $parser = (new ParserFactory)->createForNewestSupportedVersion();
        $code = file_get_contents(__DIR__ . '/' . $sourceFile);
        $ast = $parser->parse($code);

        $visitor = new PHP_to_JSON();
        $traverser = new NodeTraverser();
        $traverser->addVisitor($visitor);
        $traverser->traverse($ast);

        $outputData = array_merge(["_comment" => $jsonFile], $visitor->data);
        file_put_contents(__DIR__ . '/' . $jsonFile, json_encode($outputData, JSON_PRETTY_PRINT));
        echo "--- MSync: Created {$jsonFile} ---\n";
    }

    private static function runEntitiesSync(): void
    {
        $parser = (new ParserFactory)->createForNewestSupportedVersion();
        $scanner = new Entities_to_JSON();

        foreach (glob(__DIR__ . '/*Constant.php') as $file) {
            if (str_contains($file, 'Entities_to_JSON')) continue;

            $code = file_get_contents($file);
            $ast = $parser->parse($code);
            $traverser = new NodeTraverser();
            $traverser->addVisitor($scanner);
            $traverser->traverse($ast);
        }

        $finalData = ["_comment" => "1_Entities.json", "entities" => $scanner->entities];
        file_put_contents(__DIR__ . '/1_Entities.json', json_encode($finalData, JSON_PRETTY_PRINT));
        echo "--- MSync: Created 1_Entities.json ---\n";
    }
}

// Trigger sync
\App\Constant\MSync::syncAll();
