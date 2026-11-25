<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use App\Constant\Logger;

class RecordService
{
    public function __construct(
        protected FileService $fileService
    ) {}

    protected function resolveModel(string $entity)
    {
        $modelName = 'App\\Models\\' . ucfirst(Str::singular($entity));

        if (!class_exists($modelName)) {
            Logger::error("Entity [{$entity}] not found.");
        }

        return new $modelName();
    }

    protected function resolveFolder(string $entity): string
    {
        return strtolower(trim($entity, '/'));
    }

    protected function handleUploadedImage(string $entity, array $data, ?UploadedFile $file): array
    {
        if (!$file) {
            return $data;
        }

        $folder = $this->resolveFolder($entity);
        $result = $this->fileService->save_file(
            file: $file,
            folder: $folder,
            disk: FileService::DISK_PUBLIC,
            default_filename: '',
            caller_class: static::class
        );

        if (false === $result['ok']) {
            Logger::error($result['message'] ?: 'Failed to save uploaded image.');
        }

        $data['image'] = $result['filename'];

        return $data;
    }

    /**
     * Resolve field names defined as file inputs from the entity DTO metadata.
     *
     * @param string $entity Entity name (e.g. 'shops')
     * @return array<int, string> File field names (e.g. ['image'])
     */
    protected function getFileFields(string $entity): array
    {
        $dtoClass = $this->resolveDtoClass($entity);
        if (!$dtoClass || !method_exists($dtoClass, 'getMetadata')) {
            return [];
        }

        $fileFields = [];
        foreach ($dtoClass::getMetadata() as $field => $meta) {
            if (($meta['input'] ?? null) === 'file') {
                $fileFields[] = $field;
            }
        }

        return $fileFields;
    }

    /**
     * Replace stored file names on file-input fields with public URLs.
     *
     * @param \Illuminate\Support\Collection $records Records returned from Eloquent
     * @param string $entity Entity name used as storage folder (e.g. 'shops')
     * @return \Illuminate\Support\Collection Updated records collection
     */
    protected function hydrate_file_URL($records, string $entity)
    {
        $fileFields = $this->getFileFields($entity);
        if (empty($fileFields) || $records->isEmpty()) {
            return $records;
        }

        return $records->transform(function ($record) use ($entity, $fileFields) {
            foreach ($fileFields as $field) {
                $filename = $record->getAttribute($field);
                if (!is_string($filename) || $filename === '') {
                    continue;
                }

                $record->setAttribute(
                    $field,
                    $this->fileService->get_public_url(
                        $filename,
                        folder: $entity,
                        disk: FileService::DISK_PUBLIC
                    )
                );
            }

            return $record;
        });
    }

    /**
     * Retrieve all records for an entity and resolve file field URLs.
     *
     * @param string $entity Entity name (e.g. 'shops')
     * @return \Illuminate\Database\Eloquent\Collection Collection of records
     */
    public function getAll(string $entity)
    {
        $model = $this->resolveModel($entity);
        $records = $model->all();

        return $this->hydrate_file_URL($records, $entity);
    }

    public function create(string $entity, array $data, ?UploadedFile $file = null)
    {
        $model = $this->resolveModel($entity);
        $payload = $this->handleUploadedImage($entity, $data, $file);
        $record = $model->create($payload);

        return $record->id ?? $record->getKey();
    }

    public function update(string $entity, int $id, array $data, ?UploadedFile $file = null)
    {
        $model = $this->resolveModel($entity);
        $record = $model->find($id);

        if (!$record) {
            return false;
        }

        $payload = $this->handleUploadedImage($entity, $data, $file);

        return $record->update($payload);
    }

    public function delete(string $entity, int $id)
    {
        $model = $this->resolveModel($entity);
        $record = $model->find($id);

        if (!$record) {
            return false;
        }

        return $record->delete();
    }

    protected function resolveDtoClass(string $entity): ?string
    {
        $studly = str_replace(' ', '', ucwords(str_replace('_', ' ', Str::singular($entity))));
        $dtoClass = "App\\DTOs\\{$studly}DTO";

        return class_exists($dtoClass) ? $dtoClass : null;
    }

    public function buildValidationRules(string $entity): array
    {
        $dtoClass = $this->resolveDtoClass($entity);
        if (!$dtoClass) {
            return [];
        }

        $rules = [];
        foreach ($dtoClass::getMetadata() as $field => $meta) {
            if (!empty($meta['rules'])) {
                $rules[$field] = $meta['rules'];
            }
        }

        return $rules;
    }
}
