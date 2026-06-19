<?php

namespace App\Constant;
//0_MakeMigration.php

class MakeMigration
{
    public static function run(string $tableName, array $schema): void
    {
        if ($tableName === d::users) {
            self::migrateUser($schema);
            return;
        }

        echo "--- Maker: Generating migration for {$tableName} ---\n";
    }

    private static function migrateUser(array $schema): void
    {
        echo "--- Maker: Running specific migration for Users ---\n";
        MakeUserMigration::run($schema);
    }
}
