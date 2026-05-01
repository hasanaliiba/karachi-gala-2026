<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'delegation_id',
    'module_id',
    'fee_snapshot',
    'event_datetime_snapshot',
    'venue_snapshot',
])]
class DelegationModule extends Model
{
    protected $table = 'delegation_module';

    protected function casts(): array
    {
        return [
            'event_datetime_snapshot' => 'datetime',
        ];
    }

    public function delegation(): BelongsTo
    {
        return $this->belongsTo(Delegation::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}

