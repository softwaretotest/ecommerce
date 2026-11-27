<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class Google_Session_Controller_firebase extends Controller
{
    public function login_With_Google(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        $claims = $this->verify_Google_Id_Token($validated['id_token']);

        $email = $claims['email'] ?? null;
        if (!is_string($email) || $email === '') {
            return response()->json(['message' => 'Missing email in token'], 422);
        }

        $google_Sub = $claims['sub'] ?? null;

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $claims['name'] ?? Str::before($email, '@'),
                'password' => bcrypt(Str::random(32)),
                'google_sub' => is_string($google_Sub) ? $google_Sub : null,
                'google_id_token' => $validated['id_token'],
            ]
        );

        Auth::login($user, true);
        $request->session()->regenerate();

        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
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
        $client_Id = config('services.google.client_id');
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
