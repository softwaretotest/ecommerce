<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Select_product extends Model
{
    protected $fillable = ['product_id', 'quantity'];

    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\Product::class);
    }
}
