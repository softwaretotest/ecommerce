<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RecordService;

class RecordController extends Controller
{
    protected RecordService $recordService;

    public function __construct(RecordService $recordService)
    {
        $this->recordService = $recordService;
    }

    // ดึงข้อมูลทั้งหมดของ Entity นั้นๆ (เช่น /api/records/users หรือ /api/records/products)
    public function index(string $entity)
    {
        return response()->json($this->recordService->getAll($entity));
    }

    // สร้างข้อมูลใหม่
    public function store(Request $request, string $entity)
    {
        $id = $this->recordService->create($entity, $request->all());
        return response()->json(['id' => $id, 'success' => true]);
    }

    // อัปเดตข้อมูล
    public function update(Request $request, string $entity, $id)
    {
        $success = $this->recordService->update($entity, $id, $request->all());
        return response()->json(['success' => $success]);
    }

    // ลบข้อมูล
    public function destroy(string $entity, $id)
    {
        $success = $this->recordService->delete($entity, $id);
        return response()->json(['success' => $success]);
    }
}
