<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('delegation_id')->nullable()->change();
            $table->foreignId('social_registration_id')->nullable()->after('delegation_id')->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['social_registration_id']);
            $table->dropColumn('social_registration_id');
            $table->foreignId('delegation_id')->nullable(false)->change();
        });
    }
};
