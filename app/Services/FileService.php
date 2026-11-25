<?php

namespace App\Services;

use App\Constant\Logger;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService
{
    public const DISK_PUBLIC = 'public';
    public const DISK_PRIVATE = 'local';

    public const ALLOWED_EXTENSIONS = [
        'jpeg',
        'jpg',
        'png',
        'gif',
        'webp',
        'pdf',
        'txt',
        'doc',
        'docx',
        'docm',
    ];

    /**
     * Save an uploaded file to storage and return the filename or alert message.
     *
     * @return array{ok: bool, filename: string, message: string}
     */
    public function save_file(
        UploadedFile $file,
        string $folder = '',
        string $disk = self::DISK_PUBLIC,
        string $default_filename = '',
        string $caller_class = ''
    ): array {
        $extension = $file->getClientOriginalExtension() ?: $file->extension();
        $clean_ext = $this->clean_ext((string) $extension);

        if (! in_array($clean_ext, self::ALLOWED_EXTENSIONS, true)) {
            return [
                'ok' => false,
                'filename' => $default_filename,
                'message' => 'Unsupported file extension.',
            ];
        }

        $target_folder = $this->get_storage_folder($caller_class, $folder);
        $filename = $this->make_filename($clean_ext);

        /** @var \Illuminate\Filesystem\FilesystemAdapter $filesystem */
        $filesystem = Storage::disk($disk);
        $stored_path = $filesystem->putFileAs($target_folder, $file, $filename);

        if (! $stored_path) {
            Logger::error("Failed to save file [{$target_folder}/{$filename}] on disk [{$disk}].");

            return [
                'ok' => false,
                'filename' => $default_filename,
                'message' => 'Unable to save file.',
            ];
        }

        return [
            'ok' => true,
            'filename' => $filename,
            'message' => '',
        ];
    }

    public function get_storage_folder(string $caller_class, string $folder): string
    {
        $clean_folder = strtolower(trim($folder, " \t\n\r\0\x0B/"));

        if ($clean_folder !== '') {
            return $clean_folder;
        }

        $short_name = class_basename($caller_class);
        $without_suffix = preg_replace('/Service$/', '', $short_name);

        return strtolower(trim((string) $without_suffix, " \t\n\r\0\x0B_"));
    }

    public function clean_ext(string $extension): string
    {
        return strtolower(trim($extension, " \t\n\r\0\x0B."));
    }

    public function make_filename(string $extension): string
    {
        return Str::uuid()->toString() . '.' . $this->clean_ext($extension);
    }

    public function get_public_url(
        string $filename,
        string $folder = '',
        string $disk = self::DISK_PUBLIC,
        string $caller_class = ''
    ): string {
        $target_folder = $this->get_storage_folder($caller_class, $folder);
        $path = $target_folder !== '' ? "{$target_folder}/{$filename}" : $filename;

        /** @var \Illuminate\Filesystem\FilesystemAdapter $filesystem */
        $filesystem = Storage::disk($disk);

        return $filesystem->url($path);
    }
}
