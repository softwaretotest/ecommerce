<?php

namespace App\Constant;

class OauthConstant
{
    public const TABLE_NAME = t::OAUTHS;

    public static function fields(): array
    {
        return [
            f::USER_ID,
            f::ACCOUNT_TYPE,
            f::OPEN_AUTH_UID,
        ];
    }
}
