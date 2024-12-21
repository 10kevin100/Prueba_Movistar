<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminOrEmployeeMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Verificar si el usuario tiene el rol 'admin' o 'employee'
        if ($request->user() && in_array($request->user()->role, ['admin', 'employee'])) {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden'], 403);
    }
}