<?php

namespace App\Services;

abstract class BaseService
{
     protected string $modelClass;

     public function create(array $data)
     {
          return ($this->modelClass)::create($data);
     }

     public function getById($id)
     {
          return ($this->modelClass)::find($id);
     }

     public function getAll()
     {
          return ($this->modelClass)::all();
     }

     public function delete($id)
     {
          return ($this->modelClass)::findOrFail($id)->delete();
     }
}
