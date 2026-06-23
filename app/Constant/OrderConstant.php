<?php

namespace App\Constant;

class OrderConstant
{
    public const TABLE_NAME = t::orders;

    public static function fields(): array
    {
        return [
            f::ORDER_NR,
            f::PRODUCT_ID,
            f::USER_ID,
            f::QUANTITY,
            f::CONFIRM_ORDER,
        ];
    }
}
