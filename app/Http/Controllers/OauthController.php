<?php

namespace App\Http\Controllers;

use App\DTOs\OauthDTO;
use App\Models\Oauth;
use Illuminate\Http\Request;

class OauthController extends BaseController
{
    public function index(Request $request)
    {
        return $this->responseSuccess(Oauth::all());
    }

    public function store(Request $request)
    {
        $request->validate(OauthDTO::rules());
        $dto = OauthDTO::fromArray($request->all());
        return $this->responseSuccess(Oauth::create($dto->toArray()));
    }

    public function show(int $id)
    {
        return $this->responseSuccess(Oauth::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate(OauthDTO::rules());
        $dto = OauthDTO::fromArray($request->all());
        $item = Oauth::findOrFail($id);
        $item->update($dto->toArray());
        return $this->responseSuccess($item);
    }

    public function destroy($id)
    {
        return Oauth::findOrFail($id)->delete();
    }
}
