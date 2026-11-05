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

    useEffect(() => {
        fetch();
    }, [fetch]);

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
