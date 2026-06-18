<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // CLEAR ALL
        // DB::statement('TRUNCATE TABLE products RESTART IDENTITY CASCADE'); //no need if using php artisan migrate:fresh --seed


        // SEEDING

        $this->call([
            UserSeeder::class,
        ]);

        $this->call([
            ProductSeeder::class,
        ]);

        $this->call([
            OrderSeeder::class,
        ]);
    }
}
