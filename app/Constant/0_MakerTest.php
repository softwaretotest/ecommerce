<?php

namespace App\Constant;
//0_MakerTest.php
require 'vendor/autoload.php';

class MakerTest
{
    public static function run(): void
    {
        $entities = [
            UserConstant::class,
            ShopConstant::class,
            ProductConstant::class
        ];

        foreach ($entities as $entity) {
            echo "--- MakerTest: Running for {$entity} ---\n\n";

            Maker::run($entity);

            /**
             * wait 1s to make migration file 
             * to let MakerBot order migration.php correctly
             * like entities order above here in this test class
             * 
             * letter when project finish,
             * MakerBot will read all EntityConstant at once
             * and order migration correctly
             * 
             * by the way, when DEV config M-Project-App in UI
             * DEV must define the migration order of App tables himself
             */
            sleep(1);
        }
    }
}

MakerTest::run();
