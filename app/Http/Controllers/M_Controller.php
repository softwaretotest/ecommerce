<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class M_Controller extends Controller
{
    /**
     * DICTIONARY:
     * - app_data: Content of 1_App-Data.json
     * - m_data:   Content of 1_M-Data.json
     * - entities: Content of 1_Entities.json
     */
    public function getMetadata(): JsonResponse
    {
        $files = [
            'app_data' => base_path('app/Constant/1_App-Data.json'),
            'm_data'   => base_path('app/Constant/1_M-Data.json'),
            'entities' => base_path('app/Constant/1_Entities.json'),
        ];

        $combinedMetadata = [];

        foreach ($files as $key => $path) {
            if (!file_exists($path)) {
                return response()->json(['error' => "Metadata file not found: {$key}"], 404);
            }

            $content = file_get_contents($path);
            $jsonData = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['error' => "Invalid JSON in {$key}: " . json_last_error_msg()], 500);
            }

            $combinedMetadata[$key] = $jsonData;
        }

        return response()->json($combinedMetadata);
    }
}
