<?php

namespace App\Constant;

class ProductConstant
{
    public const TABLE_NAME = t::products;

    public const PRICE_TOTAL = 10;
    public const PRICE_DECIMAL = 2;

    public const STOCK_TOTAL = 10;
    public const STOCK_DECIMAL = 10;

    public const STOCK_MIN = -999999;

    public static function fields(): array
    {
        return [
            f::NAME,
            f::IMAGE,
            f::SHOP_ID,
            f::PRICE,
            f::STOCK,
        ];
    }
}
