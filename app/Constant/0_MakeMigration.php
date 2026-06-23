<?php

namespace App\Constant;
//0_MakeMigration.php

class MakeMigration
{
    private static array $dbSchema = [];

    /**
     * Entry point to trigger migration analysis or creation.
     */
    public static function run(string $tableName, array $schema): void
    {
        echo "--- Maker: Get DB schema for {$tableName} ---\n\n";

        self::$dbSchema = [];
        foreach ($schema as $fieldName => $data) {
            self::$dbSchema[$fieldName] = $data['db'];
        }

        // echo "--- Maker: Current DB Schema Config ---\n\n";
        // print_r(self::$dbSchema);
        // echo "--------------------------------------\n\n";

        echo "--- Maker: Starting Migration Generation for [{$tableName}] ---\n\n";

        // Search for the migration file dynamically based on tableName
        $files = glob(__DIR__ . "/../../database/migrations/*_create_{$tableName}_table.php");

        if (!empty($files) && is_string($files[0]) && $tableName === 'users') {
            echo "--- Maker: Found existing migration for [{$tableName}]. Preparing to analyze... ---\n\n";
            self::replaceExisting($files[0], $tableName);
        } else {
            echo "--- Maker: No migration found for [{$tableName}]. Preparing to create new one... ---\n\n";
            MigrationFile::createNew($tableName);
        }
    }

    /**
     * Overwrite the existing migration file with the processed content.
     */
    public static function replaceExisting(string $filePath, string $tableName): void
    {
        $content = file_get_contents($filePath);
        $newContent = self::updateMigration($content, $tableName);

        if ($content !== $newContent) {
            if (is_writable($filePath)) {
                file_put_contents($filePath, $newContent);
                echo "--- Maker: Successfully updated migration file at [{$filePath}] ---\n\n";
            } else {
                echo "--- Maker: Error! File is not writable: [{$filePath}] ---\n\n";
            }
        } else {
            echo "--- Maker: No changes detected. Migration file is already up to date. ---\n\n";
        }
    }

    /**
     * Orchestrates the transformation of the migration content.
     */
    private static function updateMigration(string $content, string $tableName): string
    {
        $content = str_replace('tablename', $tableName, $content);

        $lines = explode("\n", $content);
        $fields = [];

        /**
         * Before: $table->string('name');
         * After:  $table->string('name')->required();
         */
        $lines = DBOption::makeLines($lines, $fields, $tableName, self::$dbSchema);

        echo "--- Maker: Fields processed: " . implode(', ', $fields) . " ---\n\n";
        return implode("\n", $lines);
    }
}
