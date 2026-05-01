<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dateTime('event_datetime')->nullable()->after('normal_price');
            $table->string('venue')->nullable()->after('event_datetime');
            $table->unsignedInteger('team_size')->default(1)->after('venue');
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn(['event_datetime', 'venue', 'team_size']);
        });
    }
};

