<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'product_id', 'order_nr'];

    protected static function boot()
    {
        parent::boot();
        static::created(function ($order) {

            $order->order_nr = $order->id . '_' . $order->user_id . '_' . $order->product_id . '_' . time();
            $order->saveQuietly();
        });
    }
}
