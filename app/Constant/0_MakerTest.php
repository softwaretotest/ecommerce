<?php

namespace App\Constant;
//0_MakerTest.php
require 'vendor/autoload.php';

Maker::checkDuplicate();
Maker::run(UserConstant::class);
Maker::run(ShopConstant::class);
Maker::run(ProductConstant::class);
