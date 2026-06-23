<?php

namespace App\Constant;

class OrderConstant extends BaseConstant
{
    public const TABLE_NAME = t::orders;

    protected static function childFields(): array
    {
        return [
            f::ORDER_NR,
            f::PRODUCT_ID,
            f::QUANTITY,
            f::CONFIRM_ORDER,
        ];
    }
}
