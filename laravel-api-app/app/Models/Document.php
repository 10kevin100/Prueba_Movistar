<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = ['document_type', 'document_number'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
