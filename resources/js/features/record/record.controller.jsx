import { useEffect } from "react";

function useController(store) {
    const {
        records,
        fetch,
        add,
        update,
        remove,
        loadingId,
        recordError,
        isRecordLoading,
    } = store();

    /**
     * removed to test to reduce re-render of index() on refresh
[2026-11-25 05:02:37] local.INFO: RecordController@index called {"entity":"users"} 
[2026-11-25 05:02:37] local.INFO: RecordController@index called {"entity":"shops"} 
[2026-11-25 05:02:37] local.INFO: RecordController@index called {"entity":"products"} 
[2026-11-25 05:02:37] local.INFO: RecordController@index called {"entity":"users"} 
[2026-11-25 05:02:37] local.INFO: RecordController@index called {"entity":"shops"} 
[2026-11-25 05:02:38] local.INFO: RecordController@index called {"entity":"products"} 
[2026-11-25 05:02:38] local.INFO: RecordController@index called {"entity":"oauth"} 
[2026-11-25 05:02:38] local.INFO: RecordController@index called {"entity":"users"} 
[2026-11-25 05:02:38] local.INFO: RecordController@index called {"entity":"oauth"} 
[2026-11-25 05:02:38] local.INFO: RecordController@index called {"entity":"users"} 
[2026-11-25 05:02:38] local.INFO: RecordController@index called {"entity":"oauth"} 
[2026-11-25 05:02:38] local.INFO: RecordController@index called {"entity":"select_products"} 
     */
    // useEffect(() => {
    //     fetch();
    // }, []);
    // // }, [fetch]);

    return {
        records,
        loadingId,
        isRecordLoading,
        recordError,
        fetch,
        add,
        update,
        remove,
    };
}

export default useController;
