<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RecordService;
use Illuminate\Support\Facades\Log;
use App\Constant\Logger;

class RecordController_old extends Controller
{
    protected RecordService $recordService;

    public function __construct(RecordService $recordService)
    {
        $this->recordService = $recordService;
    }

    /**
     * ```text
     * get all data from each Entity 
     * (e.g. /api/records/users or /api/records/products)
     */
    // public function index(string $entity)
    // {
    //     return response()->json($this->recordService->getAll($entity));
    // }
    public function index(string $entity)
    {
        Log::info('RecordController@index called', ['entity' => $entity]);

        try {
            $data = $this->recordService->getAll($entity);
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

    /**
     * create new store
     */
    public function store(Request $request, string $entity)
    {
        $id = $this->recordService->create($entity, $request->all());
        return response()->json(['id' => $id, 'success' => true]);
    }

    /**
     * update data
     */
    public function update(Request $request, string $entity, int $id)
    {
        $success = $this->recordService->update($entity, $id, $request->all());
        return response()->json(['success' => $success]);
    }

    /**
     * delete data
     */
    public function destroy(string $entity, $id)
    {
        $success = $this->recordService->delete($entity, $id);
        return response()->json(['success' => $success]);
    }
}
