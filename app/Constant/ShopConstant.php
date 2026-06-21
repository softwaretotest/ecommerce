<?php

namespace App\Constant;

class ShopConstant extends BaseConstant
{
    public const TABLE_NAME = t::shops;

    protected static function childFields(): array
    {
        return [];
    }
}
