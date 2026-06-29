// resources/js/Controllers/0_M_Controller.js

import { use_M_Store } from "@/Stores/0_M_Store";

export const M_Controller = {
    updateField: (path, value) => {
        use_M_Store.getState().update(path, value);
    },
};
