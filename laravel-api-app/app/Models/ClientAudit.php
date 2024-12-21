<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientAudit extends Model
{
    protected $fillable = [
        'client_id',
        'user_id',
        'action',
        'old_values',
        'new_values',
    ];
    public $timestamps = true;
}