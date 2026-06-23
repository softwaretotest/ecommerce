<?php

namespace App\Constant;
//0_TestClass.php

/**
 * TEST FIELDS - Centralized Test Registry
 */
class test
{
    public const test_table_name = 'tests';

    // Test Special Field
    public const TEST_f_1   = ['TEST_f_1',     test::TEST_s_1];
    public const TEST_s_1 = [
        'TEST_s_1',
        d::DECIMAL,
        u::TEL,
        cu::READONLY,
        [cd::DEFAULT, 0],
        cud::REQUIRED
    ];

    // Test normal Field
    public const test_f_1 = ['test_f_1', f::IMAGE];
    public const test_d_1 = ['test_d_1', d::DECIMAL];
    public const test_u_1 = ['test_u_1', u::NUMBER];
    public const test_cd_1 = ['test_cd_1', cd::UNIQUE];
    // public const test_cd_duplicate_constraint = ['test_cd_duplicate_constraint', cd::UNIQUE, cd::UNIQUE];
}
