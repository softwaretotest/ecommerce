<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


/**
 * Base entity for all records.
 * there is no db table names "records"
 */
abstract class BaseModel extends Model
{
    // protected $guarded = []; // opposite of fillable

    public function getName(): ?string
    {
        return $this->name ?? null;
    }

    public function hasName(): bool
    {
        return !empty($this->name);
    }
}
