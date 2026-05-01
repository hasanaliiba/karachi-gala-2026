<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'user_id',
    'delegation_code',
    'type',
    'socials',
    'spectator_count',
    'undertaking_accepted',
    'base_fee',
    'games_total_fee',
    'social_total_fee',
    'spectator_total_fee',
    'grand_total_fee',
    'status',
    'qr_token',
    'qr_generated_at',
])]
class Delegation extends Model
{
    protected function casts(): array
    {
        return [
            'socials' => 'array',
            'undertaking_accepted' => 'boolean',
            'qr_generated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(DelegationMember::class);
    }

    public function modules(): HasMany
    {
        return $this->hasMany(DelegationModule::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}

