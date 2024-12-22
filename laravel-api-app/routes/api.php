<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientAuditController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AuthController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
 });
Route::middleware('auth:sanctum', 'admin_or_employee')->get('/client/{client}/logs', [ClientAuditController::class, 'index']);
Route::middleware('auth:sanctum', 'admin_or_employee')->apiResource('client', ClientController::class);

Route::middleware('auth:sanctum', 'admin')->apiResource('employee', EmployeeController::class);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);