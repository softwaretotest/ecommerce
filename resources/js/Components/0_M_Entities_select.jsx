// resources/js/Components/0_M_Entities_select.jsx
import React, { useState } from "react";
import { use_M_Store } from "@/Stores/0_M_Store";
import { M_value_Service } from "../Services/0_M_value_Service";
import {
    get_all_fieldnames,
    findout_F_or_S,
} from "@/Providers/0_M_DataProvider";

/**
 * * Renders F and S choices/selected items for Entities
 * @param {Array} f_s_Class_Array - Current table's assigned fields
 * * e.g. ['f::NAME', 'f::IMAGE', 's::EMAIL', 'f::IS_ACTIVE']
 */
export function render_All_F_S(f_s_Class_Array, tablename) {
    const M_value = use_M_Store((state) => state.M_value);
    const selected_F_S = use_M_Store((state) => state.selected_F_S);
    const set_selected_F_S = use_M_Store.getState().set_selected_F_S;

    let all_choices = [];

    if (M_value) {
        Object.entries(M_value).forEach(([key, val]) => {
            if (Array.isArray(val)) {
                val.forEach((item) => {
                    all_choices.push(item);
                });
            }
        });
    }

    // state for Search Box
    const [searchTerm_f_s, set_SearchTerm_f_s] = useState("");

    /**
     * * logic to get all fieldnames from GLOBAL_METADATA
     * * @returns all f:: and s:: field names
     * * e.g. [NAME, PRICE, STOCK, EMAIL, CURRENCY, etc. ]
     */
    const all_f_s_choices = get_all_fieldnames();

    /**
     * * Get all existing field
     * * filter out already selected F and S
     * * sort alphanumeric
     */
    const filtered_all_choices = all_f_s_choices
        .filter((choice) => {
            const selected_list = selected_F_S[tablename] || [];
            const is_F = selected_list.includes("f::" + choice);
            const is_S = selected_list.includes("s::" + choice);
            return !is_F && !is_S;
        })
        .filter((choice) =>
            String(choice).toUpperCase().includes(searchTerm_f_s),
        )
        .sort((a, b) =>
            String(a).localeCompare(String(b), undefined, {
                numeric: true,
                sensitivity: "base",
            }),
        );

    return (
        <div className="entities-select-container">
            {/* Search Box for F and S */}
            <div className="entity-search-box-wrapper">
                <input
                    className="entities-input"
                    type="text"
                    placeholder="Search fields..."
                    value={searchTerm_f_s}
                    onChange={(e) =>
                        set_SearchTerm_f_s(e.target.value.toUpperCase())
                    }
                />
            </div>

            {/* List of F and S */}
            <div className="entities-choices-list">
                {filtered_all_choices.length > 0 ? (
                    filtered_all_choices.map((choice_F_S, idx) => (
                        <div
                            key={idx}
                            className="entities-choice-item"
                            onClick={() => {
                                // add to selected_F_S
                                const choice = findout_F_or_S(choice_F_S);
                                use_M_Store
                                    .getState()
                                    .add_F_S(tablename, choice);
                            }}
                        >
                            {choice_F_S}
                        </div>
                    ))
                ) : (
                    <div className="entities-no-choice">
                        {searchTerm_f_s} NOT FOUND !!! <br />
                        Please, insert a new field in APP_DATA
                    </div>
                )}
            </div>
        </div>
    );
}
