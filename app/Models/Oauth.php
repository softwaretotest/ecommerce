<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Oauth extends Model
{
    protected $fillable = ['user_id', 'account_type', 'open_auth_uid'];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
