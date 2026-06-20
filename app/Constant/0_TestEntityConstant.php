<?php

namespace App\Constant;
// 0_TestEntityConstant.php
class TestEntityConstant extends BaseConstant
{
    public const TABLE_NAME = t::test_table_name;

    protected static function childFields(): array
    {
        return [
            t::TEST_s_1, // Test Special Field
            t::test_f_1,
            t::test_d_1,
            t::test_u_1,
            // t::test_cd_duplicate_constraint,
        ];
    }
}
