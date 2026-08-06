<?php

namespace App\Constant;

class f
{
    public const GFVDF__342 = ['gfvdf__342', [d::STRING, 255], [cd::DEFAULT, 'fee3'], u::NUMBER];
    public const IMAGE = ['image', [d::STRING, 255], u::FILE, cd::NULLABLE];
    public const NAME = ['name', [d::STRING, 255], u::TEXT, cud::REQUIRED];
    public const PRICE = ['price', [d::DECIMAL, 10, 2], u::NUMBER, [cd::DEFAULT, 0], s::CURRENCY];
    public const STOCK = ['stock', [d::DECIMAL, 10, 10], u::NUMBER, [cd::DEFAULT, 0], cud::REQUIRED];
    public const IS_ACTIVE = ['is_active', d::BOOLEAN, u::SELECT, [cd::DEFAULT, true]];
    public const QUANTITY = ['quantity', [d::DECIMAL, 10, 2], u::NUMBER, [cd::DEFAULT, 1], cud::REQUIRED];
    public const CONFIRM_ORDER = ['confirm_order', d::BOOLEAN, u::SELECT, [cd::DEFAULT, false]];
    public const ORDER_NR = ['order_nr', [d::STRING, 255], u::TEXT];
    public const ORDER_ID = ['order_id', cd::FOREIGN];
    public const PRODUCT_ID = ['product_id', cd::FOREIGN];
    public const SHOP_ID = ['shop_id', cd::FOREIGN];
    public const USER_ID = ['user_id', cd::FOREIGN];
}

class t
{
    public const NEW_5 = 'new_5';
    public const OBGU324_O_ = 'obgu324_o_';
    public const GHF4_E = 'ghf4_e';
    public const _ = '_';
    public const _987 = '_987';
}
