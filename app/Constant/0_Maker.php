<?php

namespace App\Constant;
//0_Maker.php

class Maker
{
    private static ?MakeMigration $makeMigration = null;

    public static function run(string $className): void
    {
        $schema = [];
        if (!CheckDuplicate::checkDuplicate()) {
            echo "--- Maker: Aborted due to validation errors! ---\n";
        }

        $tableName = self::checkTableName($className);
        if (!$tableName) return;

        if (!class_exists($className)) {
            echo "Class {$className} not found!\n";
            return;
        }

        $fields = $className::fields();

        $tableName = $className::TABLE_NAME;
        $line = str_repeat("=", strlen($tableName) + 4);

        echo "\n";
        echo "╔{$line}╗\n";
        echo "║  {$tableName}  ║\n";
        echo "╚{$line}╝\n";
        echo "\n";

        foreach ($fields as $field) {

            /**
             * array_shift() 
             * move the first array element to $name variable 
             * and remove it from array
             * the first element is the field name 
             * according to M-Project convention
             * a field (business field) is always and array)
             * Example: 
            class f
            {
                public const IMAGE = ['image', d::STRING, u::FILE ];
            }
            class s
            {
                public const CURRENCY = ['currency', u::TEL ];
            }
             */
            $name = array_shift($field);

            if ($className === "App\Constant\ProductConstant")
                echo print_r($name, true) . "\n\n";

            $schema[$name] = MakeSchema::separate_db_ui($name, $field);
        }
        echo "--------------------------------------\n";

        if (empty($schema)) {
            echo "Error: No fields defined or analysis failed in [{$className}].\n";
            return;
        }

        if (self::$makeMigration === null) {
            self::$makeMigration = new MakeMigration();
        }

        self::$makeMigration->run($tableName, $schema);
    }

    private static function checkTableName(string $className): ?string
    {
        if (!class_exists($className)) {
            echo "Error: Class {$className} does not exist.\n";
            return null;
        }

        $reflection = new \ReflectionClass($className);

        if (!$reflection->hasConstant('TABLE_NAME')) {
            echo "Error: {$className} is missing 'TABLE_NAME' constant.\n";
            return null;
        }

        $tableName = $className::TABLE_NAME;
        if (empty($tableName)) {
            echo "Error: 'TABLE_NAME' in {$className} cannot be empty.\n";
            return null;
        }

        return $tableName;
    }
}
