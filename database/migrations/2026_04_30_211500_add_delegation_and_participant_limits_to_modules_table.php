<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('modules', 'min_delegations')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->unsignedInteger('min_delegations')->nullable()->after('second_prize');
            });
        }

        if (! Schema::hasColumn('modules', 'max_delegations')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->unsignedInteger('max_delegations')->nullable()->after('min_delegations');
            });
        }

        if (! Schema::hasColumn('modules', 'min_participants')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->unsignedInteger('min_participants')->nullable()->after('max_delegations');
            });
        }

        if (! Schema::hasColumn('modules', 'max_participants')) {
            Schema::table('modules', function (Blueprint $table) {
                $table->unsignedInteger('max_participants')->nullable()->after('min_participants');
            });
        }

        if (Schema::hasColumn('modules', 'min_cap') && Schema::hasColumn('modules', 'max_cap')) {
            DB::table('modules')->update([
                'min_delegations' => DB::raw('COALESCE(min_delegations, min_cap)'),
                'max_delegations' => DB::raw('COALESCE(max_delegations, max_cap)'),
                'min_participants' => DB::raw('COALESCE(min_participants, 1)'),
                'max_participants' => DB::raw('COALESCE(max_participants, COALESCE(team_size, 1))'),
            ]);
        }
    }

    public function down(): void
    {
        $columnsToDrop = array_values(array_filter([
            Schema::hasColumn('modules', 'min_delegations') ? 'min_delegations' : null,
            Schema::hasColumn('modules', 'max_delegations') ? 'max_delegations' : null,
            Schema::hasColumn('modules', 'min_participants') ? 'min_participants' : null,
            Schema::hasColumn('modules', 'max_participants') ? 'max_participants' : null,
        ]));

        if (! empty($columnsToDrop)) {
            Schema::table('modules', function (Blueprint $table) use ($columnsToDrop) {
                $table->dropColumn($columnsToDrop);
            });
        }
    }
};

