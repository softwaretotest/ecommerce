<?php

namespace App\Constant;

class UserConstant extends BaseConstant
{
    public const TABLE_NAME = t::users;

    protected static function childFields(): array
    {
        return [
            s::EMAIL,
            f::IS_ACTIVE,
        ];
    }
}
