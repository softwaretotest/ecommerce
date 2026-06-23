<?php

namespace App\Constant;
//0_Runner.php
require 'vendor/autoload.php';

class Runner
{
    public const MAX_MIGRATIONS = 10;
    /**
     * Instance counter ensures unique migration 
     * timestamps and prevents filename collisions.
     * e.g.
     * 2026_06_23_080333_01_create_shops_table.php
     * 2026_06_23_080333_02_create_products_table.php
     */
    public static int $entityCounter = 0;

    public static function run(): void
    {
        $entities = [
            UserConstant::class,
            ShopConstant::class,
            ProductConstant::class,
            OrderConstant::class
        ];

        $count = count($entities);
        if ($count > self::MAX_MIGRATIONS) {
            die("--- CRITICAL: Migration limit exceeded. "
                . "\n Found {$count} tables, limit is " . self::MAX_MIGRATIONS
                . "\n Please split your migration tasks across multiple runs. ---\n\n");
        }

        foreach ($entities as $entity) {
            /**
             * skip users table , because made by laravel
             * 0001_01_01_000000_create_users_table.php
             */
            if ($entity !== UserConstant::class) {
                self::$entityCounter++;
            }

            echo "--- MakerTest: Running for {$entity} (Index: " . self::$entityCounter . ") ---\n\n";

            Maker::run($entity);
        }
    }
}

Runner::run();
