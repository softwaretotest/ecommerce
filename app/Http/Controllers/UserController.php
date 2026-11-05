<?php

namespace App\Http\Controllers;

use App\DTOs\UserDTO;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    public function index(Request $request)
    {
        return $this->responseSuccess(User::all());
    }

    public function store(Request $request)
    {
        $request->validate(UserDTO::rules());
        $dto = UserDTO::fromArray($request->all());
        return $this->responseSuccess(User::create($dto->toArray()));
    }

    public function show(int $id)
    {
        return $this->responseSuccess(User::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate(UserDTO::rules());
        $dto = UserDTO::fromArray($request->all());
        $item = User::findOrFail($id);
        $item->update($dto->toArray());
        return $this->responseSuccess($item);
    }

    public function destroy($id)
    {
        return User::findOrFail($id)->delete();
    }
}
