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

        echo "--- Maker: Current DB Schema Config ---\n\n";
        print_r(self::$dbSchema);
        echo "--------------------------------------\n\n";

        echo "--- Maker: Starting Migration Generation for [{$tableName}] ---\n\n";

        // Search for the migration file dynamically based on tableName
        $files = glob(__DIR__ . "/../../database/migrations/*_create_{$tableName}_table.php");

        if (!empty($files) && is_string($files[0]) && $tableName === 'users') {
            echo "--- Maker: Found existing migration for [{$tableName}]. Preparing to analyze... ---\n\n";
            self::replaceExisting($files[0], $tableName);
        } else {
            echo "--- Maker: No migration found for [{$tableName}]. Preparing to create new one... ---\n\n";
            self::createNew($tableName);
        }
    }

    /**
     * Overwrite the existing migration file with the processed content.
     */
    private static function replaceExisting(string $filePath, string $tableName): void
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
        $processedFields = [];

        $lines = self::updateLines($lines, $processedFields);
        self::addMissingLines($lines, $processedFields);

        echo "--- Maker: Fields processed: " . implode(', ', $processedFields) . " ---\n\n";
        return implode("\n", $lines);
    }

    /**
     * updates fields on users table
     */
    private static function updateLines(array $lines, array &$processedFields): array
    {
        $inUsersTable = false;

        foreach ($lines as $index => $line) {
            if (strpos($line, "Schema::create('users'") !== false) {
                $inUsersTable = true;
                echo "--- Maker: Entered users table scope at line " . ($index + 1) . " ---\n\n";
            }

            if ($inUsersTable && strpos($line, "});") !== false) {
                $inUsersTable = false;
                echo "--- Maker: Exited users table scope at line " . ($index + 1) . " ---\n\n";
            }

            if ($inUsersTable) {
                foreach (self::$dbSchema as $fieldName => $dbOptions) {
                    if (strpos($line, "'{$fieldName}'") !== false) {
                        echo "Found match for [{$fieldName}] at line " . ($index + 1) . ": " . trim($line) . "\n\n";
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

        /**
         * slice the first db option to define e.g. 
         * public const IS_ACTIVE  = ['is_active', d::BOOLEAN, u::SELECT,  [cd::DEFAULT, true]];
         * $dbOptions = [ d::BOOLEAN, u::SELECT, [cd::DEFAULT, true] ];
         * slice to make this
         * $table->boolean('is_active')
         */
        $options = array_slice($dbOptions, 1);

        if ($type === 'foreign') {
            $targetTable = $options[0] ?? str_replace('_id', 's', $fieldName);
            $onDelete = $options[1] ?? 'cascade';

            return "\$table->foreignId('{$fieldName}')->constrained('{$targetTable}')->onDelete('{$onDelete}')";
        }

        foreach ($options as $option) {
            if (is_string($option)) {
                $line .= '->' . $option . '()';
            } elseif (is_array($option)) {
                $key = $option[0];
                $val = $option[1];
                if (strpos($key, 'default') !== false) {

                    if (is_bool($val)) {
                        $valueStr = $val ? 'true' : 'false';
                    } elseif (is_string($val)) {
                        $valueStr = "'" . $val . "'";
                    } else {
                        $valueStr = $val; // กรณีที่เป็นตัวเลข (0, 1, ฯลฯ) ให้ใส่เข้าไปตรงๆ เลย
                    }

                    $line .= "->default({$valueStr})";
                }
            }
        }
        echo "--- Maker: Replacing with: " . $line . " ---\n\n";
        return $line;
    }

    /**
     * Injects missing schema fields before the timestamps definition.
     */
    private static function addMissingLines(array &$lines, array $processedFields): void
    {
        $normalLines = [];
        $foreignLines = [];

        foreach (self::$dbSchema as $fieldName => $dbOptions) {
            if (!in_array($fieldName, $processedFields)) {
                $newLine = self::makeLine($fieldName, $dbOptions);

                // เช็คจาก $dbOptions ว่าเป็น foreign ไหม ถ้าใช่แยกไปไว้กองหลัง
                if ($dbOptions[0] === 'foreign') {
                    $foreignLines[] = "            " . $newLine . ";";
                } else {
                    $normalLines[] = "            " . $newLine . ";";
                }
            }
        }

        $allNewLines = array_merge($normalLines, $foreignLines);

        if (!empty($allNewLines)) {
            foreach ($lines as $index => $line) {
                if (strpos($line, '$table->timestamps();') !== false) {
                    echo "--- Maker: Inserting " . count($allNewLines) . " fields before timestamps ---\n\n";
                    array_splice($lines, $index, 0, $allNewLines);
                    break;
                }
            }
        }
    }

    /**
     * Creates a new migration file from the template draft.
     */
    private static function createNew(string $tableName): void
    {
        // 1. เลือก Draft ที่ถูกต้อง (ถ้าไม่ใช่ users ให้ใช้ draft กลาง)
        $isUser = ($tableName === 'users');
        $draftName = $isUser ? '0_create_users_table.php' : '0_create_entity_table.php';
        $draftPath = __DIR__ . '/' . $draftName;

        // 2. กำหนดชื่อไฟล์ปลายทางตาม Convention
        $fileName = $isUser
            ? '0001_01_01_000000_create_users_table.php'
            : date('Y_m_d_His') . "_create_{$tableName}_table.php";
        $destinationPath = __DIR__ . "/../../database/migrations/{$fileName}";

        if (file_exists($draftPath)) {
            echo "--- Maker: Found draft file. Copying to migrations directory... ---\n\n";

            // 3. ทำการคัดลอก Draft ไปเป็นไฟล์ migration จริง
            if (copy($draftPath, $destinationPath)) {
                echo "--- Maker: Successfully created new migration: {$fileName} ---\n\n";

                // 4. บัคถูกแก้ตรงนี้: เรียก replaceExisting เพื่อเอา Schema ไปฉีดใส่ทันทีที่สร้างเสร็จ
                self::replaceExisting($destinationPath, $tableName);
            } else {
                echo "--- Maker: Error! Failed to copy migration file. ---\n\n";
            }
        } else {
            echo "--- Maker: Error! Draft file not found at [{$draftPath}] ---\n\n";
        }
    }
}
