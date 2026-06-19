<?php

namespace App\Constant;
//0_MakerConstant.php

/**
 * FIELD 
 */
class f
{
    public const IMAGE      = ['image',     d::STRING,  u::FILE];
    public const NAME       = ['name',      d::STRING,  u::TEXT,    cud::REQUIRED]; //Base
    public const PRICE      = ['price',     s::CURRENCY];
    public const STOCK      = ['stock',     d::DECIMAL, u::NUMBER,  cd::DEFAULT_NR];
    public const IS_ACTIVE  = ['is_active', d::BOOLEAN, u::SELECT,  cd::DEFAULT_TRUE];
    public const ORDER_NR   = ['order_nr',  d::STRING,  u::TEXT];

    // FOREIGN
    public const ORDER_ID = ['order_id', cd::FOREIGN];
    public const SHOP_ID  = ['shop_id',  cd::FOREIGN];
    public const USER_ID  = ['user_id',  cd::FOREIGN]; //Base

    // TEST f
    public const TEST_f_1      = ['TEST_f_1',     s::TEST_s_1];
}

/**
 * SPECIAL UI FIELD exist neither in DB nor html-UI
 */
class s
{
    public const EMAIL = ['email', d::STRING,  u::TEXT, cd::UNIQUE];
    public const CURRENCY = ['currency', d::DECIMAL,  u::TEL];

    // TEST f    
    public const TEST_s_1 = ['TEST_s_1', d::DECIMAL,  u::TEL, cu::READONLY, cd::DEFAULT_NR, cud::REQUIRED];
}

/**
 * DB FIELD TYPE
 */
class d
{
    public const BOOLEAN = 'boolean';
    public const STRING = 'string';
    public const INTEGER = 'integer';
    public const DECIMAL = 'decimal';

    // TABLE NAME
    public const users = 'users';
    public const products = 'products';
    public const shops = 'shops';
    public const orders = 'orders';
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
    public const DEFAULT_NR = ['default_nr', 0];
    public const DEFAULT_TRUE = ['default_true', true];
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
