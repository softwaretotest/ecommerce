<?php

namespace App\Constant;
// Entities_to_JSON.php

require __DIR__ . '/../../vendor/autoload.php';

use PhpParser\ParserFactory;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitorAbstract;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Expr\ClassConstFetch;
use PhpParser\Node\Scalar\String_;
use PhpParser\Node\Scalar\LNumber;
use PhpParser\Node\Expr\Array_;

class Entities_to_JSON extends NodeVisitorAbstract
{
    public $entities = [];

    /**
     * Traverses each node to extract metadata.
     * 1. Extracts TABLE_NAME (e.g., const TABLE_NAME = 'users';)
     * 2. Extracts fields 
     * e.g.,     
            f::NAME,
            f::IMAGE,

    !!!! $node->stmts = Statement !!!!

    class UserConstant {

            const TABLE_NAME = 'users'; // [Statement 1]
        
            public static function fields() { // [Statement 2]
        
            return [
                f::NAME,
                f::IMAGE,
            ];
        }
    }
     */
    public function enterNode($node)
    {
        if ($node instanceof Class_ && str_ends_with($node->name->toString(), 'Constant')) {
            $tableName = null;
            $fields = [];

            foreach ($node->stmts as $stmt) {
                // Extract TABLE_NAME
                if ($stmt instanceof ClassConst) {
                    foreach ($stmt->consts as $const) {
                        if ($const->name->toString() === 'TABLE_NAME') {
                            $tableName = $this->resolveValue($const->value);
                        }
                    }
                }

                // Extract fields from function fields() method
                if ($stmt instanceof ClassMethod && $stmt->name->toString() === 'fields') {
                    foreach ($stmt->stmts as $subStmt) {
                        if ($subStmt instanceof \PhpParser\Node\Stmt\Return_) {
                            $fields = $this->resolveValue($subStmt->expr);
                        }
                    }
                }
            }

            if ($tableName) {
                $this->entities[$tableName] = $fields;
            }
        }
    }

    /**
     * DICTIONARY:
     * AST  = Code structure from *Constant.php files parsed by PhpParser
     * NODE = A specific element within the AST
     * * EXAMPLES of $node (input):
     * - String_ ('id')         -> "id"
     * - Array_ ([id, name])    -> ["id", "name"]
     * - ClassConstFetch (t::ID)-> "t::ID"
     */
    private function resolveValue($node)
    {
        if ($node instanceof String_) {
            return $node->value;
        }

        if ($node instanceof LNumber) {
            return $node->value;
        }

        if ($node instanceof Array_) {
            $arr = [];
            foreach ($node->items as $item) {
                $arr[] = $this->resolveValue($item->value);
            }
            return $arr;
        }

        if ($node instanceof ClassConstFetch) {
            // e.g. t::USER_ID -> "t::USER_ID"
            $className = $node->class->toString();
            $constName = $node->name->toString();
            return "{$className}::{$constName}";
        }

        return null;
    }
}

// Execution Logic
$parser = (new ParserFactory)->createForNewestSupportedVersion();
$scanner = new Entities_to_JSON();

// Scan files in directory
foreach (glob(__DIR__ . '/*Constant.php') as $file) {
    // e.g. basename('App/Constant/Entities_to_JSON.php') -> 'Entities_to_JSON.php'
    if (basename($file) === 'Entities_to_JSON.php') continue;

    $code = file_get_contents($file);
    $ast = $parser->parse($code);
    $traverser = new NodeTraverser();
    $traverser->addVisitor($scanner);
    $traverser->traverse($ast);
}

$finalData = [
    "_comment" => "1_Entities.json",
    "entities" => $scanner->entities
];

file_put_contents(__DIR__ . '/1_Entities.json', json_encode($finalData, JSON_PRETTY_PRINT));

echo "--- MSync: Successfully parsed Entities to 1_Entities.json ---\n";
