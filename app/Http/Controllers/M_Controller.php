<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class M_Controller extends Controller
{
    // set same path getMetadata()
    public const FILES_PATH = [
        'app_data' => 'app/Constant/M_JSON/App-Data.json',
        'm_data'   => 'app/Constant/M_JSON/M-Data.json',
        'entities' => 'app/Constant/M_JSON/Entities.json',
    ];

    private function getPath(string $key): string
    {
        return base_path(self::FILES_PATH[$key]);
    }

    /**
     * * SAVE M_value from frontend to JSON
     */
    public function save(Request $request): JsonResponse
    {
        // 1. Validate รับค่าที่จำเป็น
        $request->validate([
            'tab' => 'required|string',    // e.g. 'm_data'
            'subTab' => 'required|string', // e.g. 'd'
            'data' => 'required|array',    // new M_value
        ]);

        $tab = $request->input('tab');
        $subTab = $request->input('subTab');
        $newData = $request->input('data');

        if (!isset(self::FILES_PATH[$tab])) {
            return response()->json(['error' => 'Invalid tab specified'], 400);
        }

        $path = $this->getPath($tab);

        // 3. อ่านไฟล์เดิมออกมา
        $content = file_get_contents($path);
        $jsonData = json_decode($content, true);

        // 4. อัปเดตข้อมูลเฉพาะส่วน (Selective Update)
        // เราแทนที่เฉพาะกุญแจของ $subTab ด้วย $newData
        $jsonData[$subTab] = $newData;

        // 5. บันทึกไฟล์กลับลงไป (ใช้ JSON_PRETTY_PRINT เพื่อให้อ่านง่าย)
        File::put($path, json_encode($jsonData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return response()->json(['message' => 'Metadata updated successfully']);
    }

    /**
     * * DICTIONARY:
     * * app_data: Content of 1_App-Data.json
     * * m_data:   Content of 1_M-Data.json
     * * entities: Content of 1_Entities.json
     */
    public function getMetadata(): JsonResponse
    {

        $combinedMetadata = [];

        foreach (self::FILES_PATH as $key => $path) {
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
