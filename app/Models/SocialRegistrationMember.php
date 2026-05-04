<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'social_registration_id',
    'full_name',
    'cnic',
    'email',
    'phone',
    'social_selections',
    'line_total_fee',
])]
class SocialRegistrationMember extends Model
{
    protected function casts(): array
    {
        return [
            'social_selections' => 'array',
        ];
    }

    public function socialRegistration(): BelongsTo
    {
        return $this->belongsTo(SocialRegistration::class);
    }
}
