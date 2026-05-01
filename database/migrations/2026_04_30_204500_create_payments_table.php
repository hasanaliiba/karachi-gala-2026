<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delegation_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('amount_due');
            $table->string('status')->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('verified_by_admin_id')->nullable()->constrained('admins')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};

