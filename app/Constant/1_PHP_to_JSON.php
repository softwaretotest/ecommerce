<?php

namespace App\Constant;
// 1_PHP_to_JSON.php

require __DIR__ . '/../../vendor/autoload.php';

use PhpParser\NodeVisitorAbstract;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassConst;

class PHP_to_JSON extends NodeVisitorAbstract
{
    public $data = [];
    private $currentClassName = '';

    public function enterNode($node)
    {
        // 1. Detect Class
        // e.g., class OrderConstant { ... } -> 'OrderConstant'
        if ($node instanceof Class_) {
            $this->currentClassName = $node->name->toString();
            $this->data[$this->currentClassName] = [];
        }

        // 2. Process Constants if inside a class
        // e.g., const TABLE_NAME = 'orders';
        if ($node instanceof ClassConst && !empty($this->currentClassName)) {
            foreach ($node->consts as $const) {
                $name = $const->name->toString();
                $value = $this->resolveValue($const->value);

                // Assign to class data
                $this->data[$this->currentClassName][$name] = $value;
            }
        }
    }

    private function resolveValue($node)
    {
        // e.g., 'value' -> "value"
        if ($node instanceof \PhpParser\Node\Scalar\String_) {
            return $node->value;
        }

        // e.g., 123 -> 123
        if ($node instanceof \PhpParser\Node\Scalar\LNumber) {
            return $node->value;
        }

        // e.g., [a, b] -> ["a", "b"]
        if ($node instanceof \PhpParser\Node\Expr\Array_) {
            $arr = [];
            foreach ($node->items as $item) {
                $arr[] = $this->resolveValue($item->value);
            }
            return $arr;
        }

        // e.g., t::orders -> "t::orders"
        if ($node instanceof \PhpParser\Node\Expr\ClassConstFetch) {
            $class = $node->class->toString();
            $const = $node->name->toString();
            return "{$class}::{$const}";
        }

        return null;
    }
}
