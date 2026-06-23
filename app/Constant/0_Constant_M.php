<?php

namespace App\Constant;
//0_Constant_M.php

/**
 * SPECIAL UI FIELD exist neither in DB nor html-UI
 * must be validated in UI
 */
class s
{
    public const EMAIL    = ['email',    d::STRING,  u::TEXT, cd::UNIQUE];
    public const CURRENCY = ['currency', u::TEL];
}

/**
 * CONSTRAINT DB
 */
class cd
{
    public const NULLABLE = 'nullable';
    public const DEFAULT = 'default';
    public const PRIMARY = 'primary';
    public const FOREIGN = 'foreign';
    public const UNIQUE = 'unique';
    public const INDEX = 'index';
}

/**
 * DB FIELD TYPE
 */
class d
{
    public const BOOLEAN = 'boolean';
    /**
     * @example [d::DEFAULT, $value]
     */
    public const DEFAULT = 'default';

    /**
     * @example [d::DECIMAL, int $total, int $places]
     */
    public const DECIMAL = 'decimal';

    /**
     * @example [d::STRING, int $length]
     */
    public const STRING = 'string';

    /**
     * @example [d::FOREIGN, string $table, string $onDelete = 'cascade']
     */
    public const FOREIGN = 'foreign';

    /**
     * @example [d::UNSIGNED_BIG_INTEGER]
     */
    public const UNSIGNED_BIG_INTEGER = 'unsignedBigInteger';

    /**
     * @example [d::NULLABLE]
     */
    public const NULLABLE = 'nullable';

    /**
     * @example [d::INDEX]
     */
    public const INDEX = 'index';

    /**
     * @example [d::UNIQUE]
     */
    public const UNIQUE = 'unique';
}

/**
 * UI FIELD TYPE
 */
class u
{
    public const TEXT = 'text';
    public const NUMBER = 'number';
    public const SELECT = 'select';
    public const FILE = 'file';
    public const TEL = 'tel';
}

/**
 * CONSTRAINT UI 
 */
class cu
{
    public const READONLY = 'readonly';
    public const DISABLED = 'disabled';
}

/**
 * CONSTRAINT UI and DB
 */
class cud
{
    public const REQUIRED = 'required';
}


/**
 * TEST FIELDS - Centralized Test Registry
 */
class test
{
    public const test_table_name = 'tests';

    // Test Special Field
    public const TEST_f_1   = ['TEST_f_1',     test::TEST_s_1];
    public const TEST_s_1 = [
        'TEST_s_1',
        d::DECIMAL,
        u::TEL,
        cu::READONLY,
        [cd::DEFAULT, 0],
        cud::REQUIRED
    ];

    // Test normal Field
    public const test_f_1 = ['test_f_1', f::IMAGE];
    public const test_d_1 = ['test_d_1', d::DECIMAL];
    public const test_u_1 = ['test_u_1', u::NUMBER];
    public const test_cd_1 = ['test_cd_1', cd::UNIQUE];
    // public const test_cd_duplicate_constraint = ['test_cd_duplicate_constraint', cd::UNIQUE, cd::UNIQUE];
}
