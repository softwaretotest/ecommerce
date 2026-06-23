<?php

namespace App\Constant;
//0_Constant_APP.php

/**
 * FIELD 
 */
class f
{
    public const IMAGE      = ['image',     d::STRING,          u::FILE]; //Base
    public const NAME       = ['name',      d::STRING,          u::TEXT,                        cud::REQUIRED]; //Base
    public const PRICE      = ['price',     [d::DECIMAL, 10, 2],  u::NUMBER,  [cd::DEFAULT, 0],   s::CURRENCY];
    public const STOCK      = ['stock',     [d::DECIMAL, 10, 10], u::NUMBER,  [cd::DEFAULT, 0], cud::REQUIRED];
    public const IS_ACTIVE  = ['is_active', d::BOOLEAN,         u::SELECT,    [cd::DEFAULT, true]];
    public const QUANTITY   = ['quantity',  d::DECIMAL,         u::NUMBER,    [cd::DEFAULT, 1], cud::REQUIRED];
    public const CONFIRM_ORDER = ['confirm_order', d::BOOLEAN,  u::SELECT,    [cd::DEFAULT, false]];
    public const ORDER_NR   = ['order_nr',  d::STRING,          u::TEXT];

    // FOREIGN
    public const ORDER_ID = ['order_id', cd::FOREIGN];
    public const PRODUCT_ID = ['product_id', d::FOREIGN];
    public const SHOP_ID  = ['shop_id',  cd::FOREIGN];
    public const USER_ID  = ['user_id',  cd::FOREIGN]; //Base
}

class t
{
    // TABLE NAME
    public const users = 'users';
    public const products = 'products';
    public const shops = 'shops';
    public const orders = 'orders';
}
