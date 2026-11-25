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

            if ($entity === 'shops') {
                Log::info('RecordController@index shops data', [
                    'count' => is_countable($data) ? count($data) : null,
                    'sample' => is_array($data) ? ($data[0] ?? null) : (method_exists($data, 'first') ? $data->first() : $data),
                ]);
            }

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
    //     // $this->validateRecord($request, $entity);

    //     $data = $request->except('image');
    //     $file = $request->file('image');

    //     $id = $this->recordService->create($entity, $data, $file);
    //     return response()->json(['id' => $id, 'success' => true]);
    // }

    public function store(Request $request, string $entity)
    {
        \Illuminate\Support\Facades\Log::info('store hit', [
            'entity' => $entity,
            'content_type' => $request->header('Content-Type'),
            'all_keys' => array_keys($request->all()),
            'allFiles_keys' => array_keys($request->allFiles()),
            'image_type' => gettype($request->input('image')),
            'image_value' => $request->input('image'),
        ]);

        $fileService = new FileService();

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

                \Illuminate\Support\Facades\Log::info('store save_file result', [
                    'field' => $field,
                    'saved' => $saved,
                ]);

                if ($saved['ok']) {
                    $request->merge([$field => $saved['filename']]);
                }
            }
        }

        \Illuminate\Support\Facades\Log::info('store before validateRecord', [
            'image_after_merge' => $request->input('image'),
        ]);

        $this->validateRecord($request, $entity);

        $data = $request->all();
        $id = $this->recordService->create($entity, $data);

        return response()->json(['id' => $id, 'success' => true]);
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
