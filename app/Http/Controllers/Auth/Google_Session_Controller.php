<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class Google_Session_Controller extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'authenticated' => false,
                'user' => null,
                'oauth' => null,
            ]);
        }

        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'oauth' => [
                'user_id' => $user->id,
                'account_type' => 'google',
                'open_auth_uid' => $this->get_oauth($user->id, 'google')?->open_auth_uid,
            ],
        ]);
    }

    private function get_oauth(int|string $userId, string $accountType): ?object
    {
        return \Illuminate\Support\Facades\DB::table('oauths') // <-- เปลี่ยนเป็นชื่อตารางจริงใน pgAdmin
            ->where('user_id', $userId)
            ->where('account_type', $accountType)
            ->first();
    }

    public function login_With_Google(Request $request): JsonResponse
    {
        $debug_Id = Str::uuid()->toString();

        Log::info('[GoogleAuth][start]', [
            'debug_id' => $debug_Id,
            'has_id_token' => $request->has('id_token'),
            'token_length' => is_string($request->input('id_token')) ? strlen($request->input('id_token')) : 0,
            'session_id_before' => $request->hasSession() ? $request->session()->getId() : null,
        ]);

        try {
            $validated = $request->validate([
                'id_token' => ['required', 'string'],
            ]);

            Log::info('[GoogleAuth][validated]', [
                'debug_id' => $debug_Id,
            ]);

            $claims = $this->verify_Google_Id_Token($validated['id_token']);

            Log::info('[GoogleAuth][token_verified]', [
                'debug_id' => $debug_Id,
                'claims_keys' => is_array($claims) ? array_keys($claims) : [],
                'aud' => $claims['aud'] ?? null,
                'iss' => $claims['iss'] ?? null,
                'exp' => $claims['exp'] ?? null,
                'email' => $claims['email'] ?? null,
                'email_verified' => $claims['email_verified'] ?? null,
                'sub' => $claims['sub'] ?? null,
            ]);

            $email = $claims['email'] ?? null;
            if (!is_string($email) || $email === '') {
                Log::warning('[GoogleAuth][missing_email]', [
                    'debug_id' => $debug_Id,
                    'claims' => $claims,
                ]);

                return response()->json([
                    'message' => 'Missing email in token',
                    'debug_id' => $debug_Id,
                ], 422);
            }

            $google_Sub = $claims['sub'] ?? null;
            $resolved_Name = $claims['name'] ?? Str::before($email, '@');

            Log::info('[GoogleAuth][before_update_or_create]', [
                'debug_id' => $debug_Id,
                'email' => $email,
                'resolved_name' => $resolved_Name,
                'google_sub' => is_string($google_Sub) ? $google_Sub : null,
            ]);

            $user = User::query()->updateOrCreate(
                ['email' => $email],
                [
                    'name' => $resolved_Name,
                    'password' => bcrypt(Str::random(32)),
                    'google_sub' => is_string($google_Sub) ? $google_Sub : null,
                    'google_id_token' => $validated['id_token'],
                ]
            );

            Log::info('[GoogleAuth][user_saved]', [
                'debug_id' => $debug_Id,
                'user_id' => $user->id,
                'was_recently_created' => $user->wasRecentlyCreated,
                'email' => $user->email,
            ]);

            Auth::login($user, true);
            $request->session()->regenerate();

            Log::info('[GoogleAuth][session_ready]', [
                'debug_id' => $debug_Id,
                'auth_id' => Auth::id(),
                'session_id_after' => $request->session()->getId(),
            ]);

            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'oauth' => [
                    'user_id' => $user->id,
                    'account_type' => 'google',
                    'open_auth_uid' => $this->get_oauth($user->id, 'google')?->open_auth_uid,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('[GoogleAuth][validation_failed]', [
                'debug_id' => $debug_Id,
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
                'debug_id' => $debug_Id,
            ], 422);
        } catch (\Throwable $e) {
            Log::error('[GoogleAuth][exception]', [
                'debug_id' => $debug_Id,
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'debug_id' => $debug_Id,
            ], 500);
        }
    }

    public function destroy(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['authenticated' => false]);
    }

    private function verify_Google_Id_Token(string $id_Token): array
    {
        $client_Id = config('services.google.client_id') ?: env('GOOGLE_CLIENT_ID');

        if (!is_string($client_Id) || $client_Id === '') {
            throw new RuntimeException('Google client_id is not configured');
        }

        $response = Http::timeout(10)->get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $id_Token,
        ]);

        if (!$response->successful()) {
            throw new RuntimeException('Invalid Google ID token');
        }

        $payload = $response->json();
        if (!is_array($payload)) {
            throw new RuntimeException('Invalid Google token response');
        }

        $aud = $payload['aud'] ?? null;
        if ($aud !== $client_Id) {
            throw new RuntimeException('Google token audience mismatch');
        }

        $iss = $payload['iss'] ?? null;
        if (!in_array($iss, ['accounts.google.com', 'https://accounts.google.com'], true)) {
            throw new RuntimeException('Google token issuer mismatch');
        }

        $exp = isset($payload['exp']) ? (int) $payload['exp'] : 0;
        if ($exp <= time()) {
            throw new RuntimeException('Google token expired');
        }

        return $payload;
    }
}
