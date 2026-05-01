<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DelegationController;

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('delegations', [DelegationController::class, 'index'])->name('delegations.index');
    Route::get('delegations/create', [DelegationController::class, 'create'])->name('delegations.create');
    Route::get('delegations/{delegation}', [DelegationController::class, 'show'])->name('delegations.show');
    Route::post('delegations', [DelegationController::class, 'store'])->name('delegations.store');
    Route::post('delegations/{delegation}/proof', [DelegationController::class, 'uploadProof'])->name('delegations.proof');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
