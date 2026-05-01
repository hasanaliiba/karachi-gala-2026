<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'delegation_id',
    'member_type',
    'full_name',
    'cnic',
    'student_id',
    'institute_name',
    'gender',
    'email',
    'contact',
    'emergency_contact',
])]
class DelegationMember extends Model
{
    public function delegation(): BelongsTo
    {
        return $this->belongsTo(Delegation::class);
    }

    public function gameLinks(): HasMany
    {
        return $this->hasMany(DelegationMemberModule::class);
    }
}

