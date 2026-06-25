<?php

namespace App\Constant;
//0_Constant_M.php

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
    public const UNSIGNED_BINT = 'unsignedBigInteger';

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
 * SPECIAL UI FIELD exist neither in DB nor html-UI
 * must be validated in UI
 */
class s
{
    public const EMAIL    = ['email',    d::STRING,  u::TEXT, cd::UNIQUE];
    public const CURRENCY = ['currency', u::TEL];
}
