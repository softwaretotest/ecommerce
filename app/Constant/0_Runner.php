<?php

namespace App\Constant;
//0_Runner.php
require 'vendor/autoload.php';

class Runner
{
    public const MAX_MIGRATIONS = 10;
    /**
     * * Instance counter does :
     * * 1. limit Runner to MAX_MIGRATIONS
     * * 2. ensures unique migration 
     * * timestamps and prevents filename collisions.
     * * e.g.
     * * 2026_06_23_080333_01_create_shops_table.php
     * * 2026_06_23_080333_02_create_products_table.php
     */
    public static int $entityCounter = 0;

    public static function run(): void
    {
        /**
         * * we need to have UserConstant::class,  in $entities
         * * to auto. add template of *create_users_table.php if not exists
         * * But, in MakeMigration.php we skip our change 
         * * in Laravel user migration 
         * * to avoid error "overwrite Laravel user Migration flow", 
         * * but we can add table user_details instead, 
         * * if user specific info. needed
         */

        // these classes for test ecommerce app
        $entities = [
            UserConstant::class,
            ShopConstant::class,
            ProductConstant::class,
            OrderConstant::class
        ];

        // // dynamicly get app/Constant/EntityContant.php 
        // $entities = (array) self::get_Entities();

        $count = count($entities);
        if ($count > self::MAX_MIGRATIONS) {
            die("--- CRITICAL: Migration limit exceeded. "
                . "\n Found {$count} tables, limit is " . self::MAX_MIGRATIONS
                . "\n Please split your migration tasks across multiple runs. ---\n\n");
        }

        foreach ($entities as $entity) {
            /**
             * skip counting for users table , because made by Laravel
             * 0001_01_01_000000_create_users_table.php
             */
            if ($entity !== UserConstant::class) {
                self::$entityCounter++;
            }

            echo "--- MakerTest: Running for {$entity} (Index: " . self::$entityCounter . ") ---\n\n";

            Maker::run($entity);
        }
    }

    /**
     * * get all Classes with file subfix = *Constant.php
     * @return $entities = e.g. [ UserConstant::class, ShopConstant::class ]
     */
    private static function get_Entities(): array
    {
        $entities = [];
        // 1. ค้นหาไฟล์ทั้งหมดที่ลงท้ายด้วย Constant.php ในโฟลเดอร์เดียวกัน
        $files = glob(__DIR__ . "/Entities/*Constant.php");

        foreach ($files as $file) {
            $filename = basename($file, ".php");
            $className = "App\\Constant\\Entities\\" . $filename;

            // ตรวจสอบว่าคลาสมีอยู่จริง และสามารถเรียกใช้งานได้
            if (class_exists($className)) {
                // ใช้ตัวแทนคลาสตรงๆ แบบเดียวกับ UserConstant::class
                $entities[] = $className;
            }
        }

        return $entities;
    }
}

Runner::run();
