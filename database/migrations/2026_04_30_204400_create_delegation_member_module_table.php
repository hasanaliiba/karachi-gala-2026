<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delegation_member_module', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delegation_member_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['delegation_member_id', 'module_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delegation_member_module');
    }
};

