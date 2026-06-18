<?php

namespace App\Bot;

require 'vendor/autoload.php';

use App\Constant\ProductConstant;
use App\Constant\UserConstant;
use App\Constant\ShopConstant;

// คุณสั่งให้มันอ่านคลาสไหน ก็ใส่ชื่อคลาสเข้าไปตรงนี้ครับ
Maker::run(ProductConstant::class);
Maker::run(UserConstant::class);
Maker::run(ShopConstant::class);
