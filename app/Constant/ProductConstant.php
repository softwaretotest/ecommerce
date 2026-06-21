<?php

namespace App\Constant;

class ProductConstant extends BaseConstant
{
    public const TABLE_NAME = t::products;

    public const PRICE_TOTAL = 10;
    public const PRICE_DECIMAL = 2;

    public const STOCK_TOTAL = 10;
    public const STOCK_DECIMAL = 10;

    public const STOCK_MIN = -999999;

    protected static function childFields(): array
    {
        return [
            f::SHOP_ID,
            f::PRICE,
            f::STOCK,
        ];
    }
}
