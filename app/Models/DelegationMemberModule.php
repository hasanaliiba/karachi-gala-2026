<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['delegation_member_id', 'module_id'])]
class DelegationMemberModule extends Model
{
    protected $table = 'delegation_member_module';

    public function member(): BelongsTo
    {
        return $this->belongsTo(DelegationMember::class, 'delegation_member_id');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}

