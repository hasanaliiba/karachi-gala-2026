<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('delegation_members', function (Blueprint $table) {
            $table->json('social_selections')->nullable()->after('emergency_contact');
        });
    }

    public function down(): void
    {
        Schema::table('delegation_members', function (Blueprint $table) {
            $table->dropColumn('social_selections');
        });
    }
};
