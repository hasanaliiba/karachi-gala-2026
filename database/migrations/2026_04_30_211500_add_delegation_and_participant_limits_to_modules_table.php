<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->unsignedInteger('min_delegations')->nullable()->after('max_cap');
            $table->unsignedInteger('max_delegations')->nullable()->after('min_delegations');
            $table->unsignedInteger('min_participants')->nullable()->after('max_delegations');
            $table->unsignedInteger('max_participants')->nullable()->after('min_participants');
        });

        DB::table('modules')->update([
            'min_delegations' => DB::raw('min_cap'),
            'max_delegations' => DB::raw('max_cap'),
            'min_participants' => 1,
            'max_participants' => DB::raw('COALESCE(team_size, 1)'),
        ]);
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn(['min_delegations', 'max_delegations', 'min_participants', 'max_participants']);
        });
    }
};

