<?php

namespace App\Constant;

class MakeUserMigration
{
    private static array $dbSchema = [];

    /**
     * Entry point to trigger migration analysis or creation.
     */
    public static function run(array $schema): void
    {
        self::$dbSchema = [];
        foreach ($schema as $fieldName => $data) {
            self::$dbSchema[$fieldName] = $data['db'];
        }

        echo "--- Maker: Current DB Schema Config ---\n";
        print_r(self::$dbSchema);
        echo "--------------------------------------\n";

        echo "--- Maker: Starting User Migration Generation ---\n";

        $files = glob(__DIR__ . '/../../database/migrations/*_create_users_table.php');

        if (!empty($files) && is_string($files[0])) {
            echo "--- Maker: Found existing user migration. Preparing to analyze... ---\n";
            self::replaceExisting($files[0]);
        } else {
            echo "--- Maker: No user migration found. Preparing to create new one... ---\n";
            self::createNew();
        }
    }

    /**
     * Overwrite the existing migration file with the processed content.
     */
    private static function replaceExisting(string $filePath): void
    {
        $content = file_get_contents($filePath);
        $newContent = self::configureMigration($content);

        if ($content !== $newContent) {
            if (is_writable($filePath)) {
                file_put_contents($filePath, $newContent);
                echo "--- Maker: Successfully updated migration file at [{$filePath}] ---\n";
            } else {
                echo "--- Maker: Error! File is not writable: [{$filePath}] ---\n";
            }
        } else {
            echo "--- Maker: No changes detected. Migration file is already up to date. ---\n";
        }
    }

    /**
     * Orchestrates the transformation of the migration content.
     */
    private static function configureMigration(string $content): string
    {
        $lines = explode("\n", $content);
        $processedFields = [];

        $lines = self::processTableLines($lines, $processedFields);
        self::addMissingFields($lines, $processedFields);

        echo "--- Maker: Fields processed: " . implode(', ', $processedFields) . " ---\n";
        return implode("\n", $lines);
    }

    /**
     * Scans and updates existing fields within the 'users' table scope.
     */
    private static function processTableLines(array $lines, array &$processedFields): array
    {
        $inUsersTable = false;

        foreach ($lines as $index => $line) {
            if (strpos($line, "Schema::create('users'") !== false) {
                $inUsersTable = true;
                echo "--- Maker: Entered users table scope at line " . ($index + 1) . " ---\n";
            }

            if ($inUsersTable && strpos($line, "});") !== false) {
                $inUsersTable = false;
                echo "--- Maker: Exited users table scope at line " . ($index + 1) . " ---\n";
            }

            if ($inUsersTable) {
                foreach (self::$dbSchema as $fieldName => $dbOptions) {
                    if (strpos($line, "'{$fieldName}'") !== false) {
                        echo "Found match for [{$fieldName}] at line " . ($index + 1) . ": " . trim($line) . "\n";
                        $lines[$index] = "            " . self::makeLine($fieldName, $dbOptions) . ";";
                        $processedFields[] = $fieldName;
                    }
                }
            }
        }
        return $lines;
    }

    /**
     * Generates a single blueprint line string based on schema options.
     */
    private static function makeLine(string $fieldName, array $dbOptions): string
    {
        $type = $dbOptions[0] ?? 'string';
        $line = '$table->' . $type . "('{$fieldName}')";

        $options = array_slice($dbOptions, 1);
        foreach ($options as $option) {
            if (is_string($option)) {
                $line .= '->' . $option . '()';
            } elseif (is_array($option)) {
                $key = $option[0];
                $val = $option[1];
                if (strpos($key, 'default') !== false) {
                    $valueStr = ($val === true) ? 'true' : ($val === false ? 'false' : $val);
                    $line .= "->default({$valueStr})";
                }
            }
        }
        echo "--- Maker: Replacing with: " . $line . " ---\n";
        return $line;
    }

    /**
     * Injects missing schema fields before the timestamps definition.
     */
    private static function addMissingFields(array &$lines, array $processedFields): void
    {
        $newLines = [];
        foreach (self::$dbSchema as $fieldName => $dbOptions) {
            if (!in_array($fieldName, $processedFields)) {
                echo "--- Maker: Adding missing field [{$fieldName}] ---\n";
                $newLine = self::makeLine($fieldName, $dbOptions);
                $newLines[] = "            " . $newLine . ";";
            }
        }

        if (!empty($newLines)) {
            foreach ($lines as $index => $line) {
                if (strpos($line, '$table->timestamps();') !== false) {
                    echo "--- Maker: Inserting " . count($newLines) . " missing fields before line " . ($index + 1) . " ---\n";
                    array_splice($lines, $index, 0, $newLines);
                    break;
                }
            }
        }
    }

    /**
     * Creates a new migration file from the template stub.
     */
    private static function createNew(): void
    {
        $stubPath = __DIR__ . '/0_create_users_table.php';
        $destinationPath = __DIR__ . '/../../database/migrations/0001_01_01_000000_create_users_table.php';

        if (file_exists($stubPath)) {
            echo "--- Maker: Found stub file. Copying to migrations directory... ---\n";

            if (copy($stubPath, $destinationPath)) {
                echo "--- Maker: Successfully created new migration: 0001_01_01_000000_create_users_table.php ---\n";

                self::replaceExisting($destinationPath);
            } else {
                echo "--- Maker: Error! Failed to copy migration file. ---\n";
            }
        } else {
            echo "--- Maker: Error! Stub file not found at [{$stubPath}] ---\n";
        }
    }
}
