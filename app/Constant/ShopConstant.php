<?php

namespace App\Constant;

class ShopConstant extends BaseConstant
{
    public const TABLE_NAME = d::shops;

    protected static function childFields(): array
    {
        return [];
    }
}
