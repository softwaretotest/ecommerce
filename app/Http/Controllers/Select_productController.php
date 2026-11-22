<?php

namespace App\Http\Controllers;

use App\DTOs\Select_productDTO;
use App\Models\Select_product;
use Illuminate\Http\Request;

class Select_productController extends BaseController
{
    public function index(Request $request)
    {
        return $this->responseSuccess(Select_product::all());
    }

    public function store(Request $request)
    {
        $request->validate(Select_productDTO::rules());
        $dto = Select_productDTO::fromArray($request->all());
        return $this->responseSuccess(Select_product::create($dto->toArray()));
    }

    public function show(int $id)
    {
        return $this->responseSuccess(Select_product::findOrFail($id));
    }

    public function update(Request $request, int $id)
    {
        $request->validate(Select_productDTO::rules());
        $dto = Select_productDTO::fromArray($request->all());
        $item = Select_product::findOrFail($id);
        $item->update($dto->toArray());
        return $this->responseSuccess($item);
    }

    public function destroy(int $id)
    {
        return Select_product::findOrFail($id)->delete();
    }
}
