<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * ```text
 * this class is made by AI https://de.aipass.net/chat/8b122fd0106540ec
 * to trace the creating session bug on every browser refresh F5
 */
class SessionIdTrace
{
    public function handle(Request $request, Closure $next): Response
    {
        $fp = fn($v) => is_string($v) ? substr(hash('sha256', $v), 0, 12) : null;

        $cookie = $request->cookies->get(config('session.cookie'));
        $atStart = $request->session()->getId();

        $response = $next($request);

        $atEnd = $request->session()->getId();

        Log::info('session.trace', [
            'path' => $request->path(),
            'cookie' => $fp($cookie),
            'at_start' => $fp($atStart),
            'at_end' => $fp($atEnd),
        ]);

        return $response;
    }
}
