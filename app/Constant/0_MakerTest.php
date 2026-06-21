<?php

namespace App\Constant;
//0_MakerTest.php
require 'vendor/autoload.php';

class MakerTest
{
    public const MAX_MIGRATIONS = 10;
    public static int $entityCounter = 0;

    public static function run(): void
    {
        $entities = [
            UserConstant::class,
            ShopConstant::class,
            ProductConstant::class
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

MakerTest::run();
