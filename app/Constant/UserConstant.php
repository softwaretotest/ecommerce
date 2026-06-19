<?php

namespace App\Constant;

class UserConstant extends BaseConstant
{
    public const TABLE_NAME = d::users;

    protected static function childFields(): array
    {
        return [
            s::TEST_s_1,
            s::EMAIL,
            f::IS_ACTIVE,
        ];
    }
}
