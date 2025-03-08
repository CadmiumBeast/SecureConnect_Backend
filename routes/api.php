<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::group(
    [
        'middleware' => 'api',
        'prefix' => 'auth'
    ],
    function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('signup', [AuthController::class, 'store']);
        Route::get('logout', 'AuthController@logout');
        Route::get('user', 'AuthController@user');
    }
    );

Route::get('/user' ,[AuthController::class, 'index'])->middleware('auth:api');

