<?php

namespace App\Constant;

class Select_productConstant
{
    public const TABLE_NAME = t::SELECT_PRODUCTS;

    public static function fields(): array
    {
        return [
            f::PRODUCT_ID,
            f::QUANTITY,
        ];
    }
}
