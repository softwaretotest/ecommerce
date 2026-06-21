<?php

namespace App\Constant;
//0_DBOption.php

class DBOption
{
    /**
     * Main entry to process all lines in a migration file.
     */
    public static function makeLines(array $lines, array &$processedFields, string $tableName, array $dbSchema): array
    {
        // 1. Update existing lines
        $lines = self::updateLines($lines, $processedFields, $tableName, $dbSchema);

        // 2. Add missing lines
        self::addMissingLines($lines, $processedFields, $dbSchema);

        return $lines;
    }

    private static function updateLines(array $lines, array &$processedFields, string $tableName, array $dbSchema): array
    {
        $inTable = false;
        foreach ($lines as $index => $line) {
            if (strpos($line, "Schema::create('{$tableName}'") !== false) {
                $inTable = true;
            }
            if ($inTable && strpos($line, "});") !== false) {
                $inTable = false;
            }

            if ($inTable) {
                foreach ($dbSchema as $fieldName => $dbOptions) {
                    if (strpos($line, "'{$fieldName}'") !== false) {
                        $lines[$index] = "            " . self::makeLine($fieldName, $dbOptions) . ";";
                        $processedFields[] = $fieldName;
                    }
                }
            }
        }
        return $lines;
    }

    private static function addMissingLines(array &$lines, array $processedFields, array $dbSchema): void
    {
        $normalLines = [];
        $foreignLines = [];

        foreach ($dbSchema as $fieldName => $dbOptions) {
            if (!in_array($fieldName, $processedFields)) {
                $newLine = self::makeLine($fieldName, $dbOptions);
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
                    array_splice($lines, $index, 0, $allNewLines);
                    break;
                }
            }
        }
    }

    /**
     * @param string $fieldName
     * @param array $dbOptions (e.g., [[d::DECIMAL, 10, 2], [cd::DEFAULT, 0], cd::NULLABLE])
     */
    public static function makeLine(string $fieldName, array $dbOptions): string
    {
        // 1. Extract Type: assume first element is always the type definition
        $typeDef = array_shift($dbOptions);

        // Handle Foreign
        if ($typeDef === 'foreign') {
            echo $fieldName . "\n";
            $targetTable = str_replace('_id', 's', $fieldName);
            // $onDelete = 'cascade'; // better not use cascade on production , can delete many data by accident
            $onDelete = 'restrict';
            return "\$table->foreignId('{$fieldName}')->constrained('{$targetTable}')->onDelete('{$onDelete}')";
        }

        // 2. Identify the Method Name (Type)
        // If $typeDef is array [d::DECIMAL, 10, 2], Method is 'decimal'
        // If $typeDef is string 'string', Method is 'string'
        $method = is_array($typeDef) ? $typeDef[0] : $typeDef;

        // 3. Build base line
        $line = "\$table->{$method}('{$fieldName}'";

        // If $typeDef was array with params (like decimal, 10, 2), add them
        if (is_array($typeDef) && count($typeDef) > 1) {
            $params = array_slice($typeDef, 1);
            $line .= ', ' . implode(', ', $params);
        }
        $line .= ")"; //close the method call

        // 4. Append additional constraints
        foreach ($dbOptions as $option) {
            $line .= self::format($option);
        }

        return $line;
    }

    /**
     * @example ->nullable()
     * @example ->default(0)
     * @example ->decimal(10, 2)
     */
    public static function format($option): string
    {
        // 1. Handle String
        if (is_string($option)) {
            return "->{$option}()";
        }

        // 2. Handle Array
        if (is_array($option)) {
            $method = array_shift($option);
            $params = [];

            foreach ($option as $val) {
                if (is_bool($val)) {
                    $params[] = $val ? 'true' : 'false';
                } elseif (is_string($val)) {
                    $params[] = "'{$val}'";
                } else {
                    $params[] = $val;
                }
            }

            $paramString = implode(', ', $params);
            return "->{$method}({$paramString})";
        }

        return "";
    }
}
