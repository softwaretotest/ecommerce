<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Symfony\Component\HttpFoundation\Response;

class SkipSessionUntilLogin
{
    public function handle(Request $request, Closure $next): Response
    {
        $cookieName = config('session.cookie');
        $hasCookie = $request->cookies->has($cookieName);
        $isLoginRoute = $request->is('login', 'auth/*', 'api/auth/*');

        if (! $hasCookie && ! $isLoginRoute) {
            app()->instance(StartSession::class, new class {
                public function handle($request, $next)
                {
                    return $next($request);
                }
            });
        }

        return $next($request);
    }
}