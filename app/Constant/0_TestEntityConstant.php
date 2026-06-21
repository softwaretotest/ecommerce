<?php

namespace App\Constant;
// 0_TestEntityConstant.php
class TestEntityConstant extends BaseConstant
{
    public const TABLE_NAME = test::test_table_name;

    protected static function childFields(): array
    {
        return [
            test::TEST_s_1, // Test Special Field
            test::test_f_1,
            test::test_d_1,
            test::test_u_1,
            // test::test_cd_duplicate_constraint,
        ];
    }
}
