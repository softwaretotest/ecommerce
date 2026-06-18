<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends BaseModel
{
    use HasFactory;

    // app/Models/Product.php

    protected $fillable = [
        'name',
        'image_url',
        'price',
        'stock',
    ];
}
