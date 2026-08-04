<?php

namespace App\Constant;
//0_Constant_M.php

/**
 * DB FIELD TYPE
 */
class d
{
    public const BOOLEAN = 'boolean';

    public const INTEGER = 'integer';

    /**
     * @example [d::DECIMAL, int $total, int $places]
     */
    public const DECIMAL = 'decimal';

    /**
     * @example [d::STRING, int $length]
     */
    public const STRING = 'string';

    public const UNSIGNED_BINT = 'unsignedBigInteger';
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


NOTE: 
we don't need PRIMARY in Class d for now, 
because we use use surrogate ID as PRIMARY KEY e.g. 
in case order_id , we don't use 
product_id + user_id + timestamp AS PRIMARY KEY
, because less db query performance thant order_id  (upto 100,000 records)
 Laravel $table->id() maked auto. REQUIRED UNIQUE AUTO-INCREMENT
 */
class cd
{
    public const NULLABLE = 'nullable';
    public const DEFAULT = 'default';
    public const UNIQUE = 'unique';
    public const INDEX = 'index';
    /**
     * hardcoded in 0_DBOption.php
     * @example [d::FOREIGN, string $table, string $onDelete = 'cascade']
     */
    public const FOREIGN = 'foreign';
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
