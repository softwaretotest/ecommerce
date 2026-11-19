<?php

namespace App\Services;

use Illuminate\Support\Str;
use Exception;

class RecordService
{
    /**
     * map entity name from frontend to Model in Laravel
     */
    protected function resolveModel(string $entity)
    {
        // change e.g. "users" -> "User", "products" -> "Product"
        $modelName = 'App\\Models\\' . Str::studly(Str::singular($entity));

        if (!class_exists($modelName)) {
            throw new Exception("Entity [{$entity}] not found.");
        }

        return new $modelName();
    }

    public function getAll(string $entity)
    {
        $model = $this->resolveModel($entity);
        return $model->all();
    }

    public function create(string $entity, array $data)
    {
        $model = $this->resolveModel($entity);
        $record = $model->create($data);
        return $record->id ?? $record->getKey();
    }

    public function update(string $entity, $id, array $data)
    {
        $model = $this->resolveModel($entity);
        $record = $model->find($id);

        if (!$record) return false;

        return $record->update($data);
    }

    public function delete(string $entity, int $id)
    {
        $model = $this->resolveModel($entity);
        $record = $model->find($id);

        if (!$record) return false;

        return $record->delete();
    }
}
