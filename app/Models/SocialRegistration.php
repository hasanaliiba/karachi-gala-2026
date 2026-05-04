<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'user_id',
    'registration_code',
    'grand_total_fee',
    'status',
    'qr_token',
    'qr_generated_at',
])]
class SocialRegistration extends Model
{
    protected function casts(): array
    {
        return [
            'qr_generated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(SocialRegistrationMember::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
