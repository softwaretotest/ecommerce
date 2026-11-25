<?php

namespace App\Http\Controllers;

use App\Constant\Logger;
use App\Services\RecordService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\FileService;

class RecordController extends Controller
{
    public function __construct(
        protected RecordService $recordService
    ) {}

    // public function index(string $entity)
    // {
    //     Log::info('RecordController@index called', ['entity' => $entity]);

    //     try {
    //         $data = $this->recordService->getAll($entity);
    //         return response()->json($data);
    //     } catch (\Throwable $e) {
    //         Log::error('RecordController@index failed', [
    //             'entity' => $entity,
    //             'message' => $e->getMessage(),
    //             'file' => $e->getFile(),
    //             'line' => $e->getLine(),
    //         ]);
    //         Logger::error($e);
    //     }
    // }

    public function index(string $entity)
    {
        Log::info('RecordController@index called', ['entity' => $entity]);

        try {
            $data = $this->recordService->getAll($entity);

            $rows = collect($data)->map(function ($row) {
                $arr = is_object($row) && method_exists($row, 'toArray')
                    ? $row->toArray()
                    : (array) $row;

                return collect($arr)->map(function ($val) {
                    if (is_array($val) || is_object($val)) {
                        return json_encode($val, JSON_UNESCAPED_UNICODE);
                    }
                    if (is_bool($val)) {
                        return $val ? 'true' : 'false';
                    }
                    if ($val === null) {
                        return 'NULL';
                    }
                    return (string) $val;
                })->all();
            })->all();

            Log::info('RecordController@index result', [
                'entity' => $entity,
                'count' => count($rows),
                'keys' => !empty($rows) ? array_keys($rows[0]) : [],
                'records' => $rows,
            ]);

            return response()->json($data);
        } catch (\Throwable $e) {
            Log::error('RecordController@index failed', [
                'entity' => $entity,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            Logger::error($e);
        }
    }

    // public function store(Request $request, string $entity)
    // {
    //     $fileService = new FileService();

    //     foreach ($request->allFiles() as $field => $file) {
    //         \Illuminate\Support\Facades\Log::info('store file item', [
    //             'field' => $field,
    //             'is_uploaded_file' => $file instanceof \Illuminate\Http\UploadedFile,
    //             'gettype' => gettype($file),
    //         ]);

    //         if ($file instanceof \Illuminate\Http\UploadedFile) {
    //             $saved = $fileService->save_file(
    //                 $file,
    //                 folder: $entity,
    //                 disk: FileService::DISK_PUBLIC,
    //                 caller_class: self::class
    //             );

    //             if ($saved['ok']) {
    //                 $request->merge([$field => $saved['filename']]);
    //             }
    //         }
    //     }

    //     $this->validateRecord($request, $entity);

    //     $data = $request->all();
    //     $id = $this->recordService->create($entity, $data);

    //     return response()->json(['id' => $id, 'success' => true]);
    // }

    /**
     * ```text
     * store file to storage
     * return record data (with file path if file exists)
     */
    public function store(Request $request, string $entity)
    {
        $fileService = new FileService();
        $uploadedUrls = [];

        foreach ($request->allFiles() as $field => $file) {
            \Illuminate\Support\Facades\Log::info('store file item', [
                'field' => $field,
                'is_uploaded_file' => $file instanceof \Illuminate\Http\UploadedFile,
                'gettype' => gettype($file),
            ]);

            if ($file instanceof \Illuminate\Http\UploadedFile) {
                $saved = $fileService->save_file(
                    $file,
                    folder: $entity,
                    disk: FileService::DISK_PUBLIC,
                    caller_class: self::class
                );

                if ($saved['ok']) {
                    $request->merge([$field => $saved['filename']]);
                    $uploadedUrls[$field] = $fileService->get_public_url(
                        $saved['filename'],
                        folder: $entity,
                        disk: FileService::DISK_PUBLIC,
                        caller_class: self::class
                    );
                }
            }
        }

        $this->validateRecord($request, $entity);

        $data = $request->all();
        $record = $this->recordService->create($entity, $data);
        $recordArray = is_object($record) && method_exists($record, 'toArray')
            ? $record->toArray()
            : (array) $record;

        foreach ($uploadedUrls as $field => $url) {
            $recordArray[$field] = $url;
        }

        return response()->json([
            'id' => $recordArray['id'],
            'success' => true,
            'data' => $recordArray,
        ]);
    }

    public function update(Request $request, string $entity, int $id)
    {
        $this->validateRecord($request, $entity);

        $data = $request->except('image');
        $file = $request->file('image');

        $success = $this->recordService->update($entity, $id, $data, $file);
        return response()->json(['success' => $success]);
    }

    public function destroy(string $entity, int $id)
    {
        $success = $this->recordService->delete($entity, $id);
        return response()->json(['success' => $success]);
    }

    /**
     * Resolve dynamic validation rules from DTO getMetadata()
     * and validate the request.
     */
    protected function validateRecord(Request $request, string $entity): void
    {
        $rules = $this->recordService->buildValidationRules($entity);
        $request->validate($rules);
    }
}
