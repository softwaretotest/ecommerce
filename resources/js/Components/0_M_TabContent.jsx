// resources/js/Components/0_M_TabContent.jsx

import { React, useState, useRef, useEffect } from "react";
import { useScrollIntoView } from "@/hooks/useScrollIntoView";

import { use_M_Store } from "@/Stores/0_M_Store.jsx";
import { M_value_Service } from "@/Services/0_M_value_Service";

import SpecialField from "@/Components/0_M_SpecialField";
import Field from "@/Components/0_M_Field";
import EntityField from "@/Components/0_M_EntityField";
import DB_Tablename from "@/Components/0_M_DB_Tablename";

export default function TabContent({ M_Class_Name }) {
    const M_value = use_M_Store((state) => state.M_value);
    const has_NEW_Field = use_M_Store((state) => state.has_NEW_Field);
    const set_has_NEW_Field = use_M_Store((state) => state.set_has_NEW_Field);
    const activeTab = use_M_Store((state) => state.activeTab);
    const activeField = use_M_Store((state) => state.activeField);
    const setActiveField = use_M_Store((state) => state.setActiveField);

    if (!M_value)
        return <div className="ui-placeholder">No UI for {M_Class_Name}</div>;

    const scrollRefs = useRef({});
    useScrollIntoView(activeField, scrollRefs);

    // define Javascript GLOBAL Variable window.D_HEAL if not exist
    if (typeof window !== "undefined" && !window.D_HEAL) {
        window.D_HEAL = { isLastField: false, total: 0, collected: {} };
    }

    function render_TabContent_DOM(fieldname, field_data) {
        return (
            <div
                key={fieldname}
                ref={(DOM_Node) => (scrollRefs.current[fieldname] = DOM_Node)}
                className={`form-subtab-content-row ${activeField === fieldname ? "is-focused" : ""}`}
                onClick={() => setActiveField(fieldname)}
            >
                {["d", "u", "cd", "cu", "cud"].includes(M_Class_Name) && (
                    <>
                        <input
                            className="M_Data_KEY"
                            defaultValue={
                                M_Class_Name === "t"
                                    ? fieldname
                                    : fieldname.toUpperCase()
                            }
                        />
                        <span className="field-separator-colon">:</span>
                        <input
                            type="text"
                            className="M_Data_VALUE"
                            defaultValue={field_data}
                        />
                    </>
                )}

                {M_Class_Name === "s" && Array.isArray(field_data) && (
                    <SpecialField field_data={field_data} />
                )}
                {M_Class_Name === "f" && Array.isArray(field_data) && (
                    <Field field_data={field_data} M_value={M_value} />
                )}
                {M_Class_Name === "t" && (
                    <DB_Tablename field_data={field_data} />
                )}
                {M_Class_Name === "entities" && (
                    <EntityField
                        f_s_Class_Array={field_data}
                        table_name={fieldname}
                    />
                )}
            </div>
        );
    }

    function check_duplicate_in_M_value(new_fieldname) {
        const target = new_fieldname.trim().toUpperCase();
        const has_same_fieldname = Object.keys(M_value).some(
            (key) => key.toUpperCase() === target,
        );
        return has_same_fieldname;
    }

    async function add_field() {
        // วิธีที่ 1: ดึงค่าผ่าน DOM querySelector สดๆ ตรงนี้เลยตามที่คุณต้องการ
        const inputElement = document.querySelector(".input_fieldname");
        const raw_name = inputElement ? inputElement.value : "";

        const trimmed_name = raw_name.trim();
        if (!trimmed_name) return;

        await set_has_NEW_Field(trimmed_name); //set flag for useEffect in Dropdown_D.jsx

        const field_data = [trimmed_name, ["d::STRING", 255]];
        const FIELDNAME = field_data[0].toUpperCase();

        const new_M_value = {
            [FIELDNAME]: field_data,
            ...M_value,
        };

        await M_value_Service.update(new_M_value);
        setActiveField(FIELDNAME); // for auto scroll

        // เคลียร์ค่าใน input ทิ้งหลังเพิ่มสำเร็จ
        if (inputElement) inputElement.value = "";
        setInputFieldname(""); // เคลียร์ state ร่วมด้วยเพื่อให้ปุ่ม disabled กลับมาล็อกเหมือนเดิม
    }

    const [inputFieldname, setInputFieldname] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    function handleFieldnameChange(value) {
        setInputFieldname(value);

        // 1. เช็คว่าว่างเปล่าไหม
        if (!value.trim()) {
            setErrorMessage("Fieldname cannot be empty.");
            return;
        }

        // 2. เช็คว่าชื่อซ้ำหรือไม่ (สมมติว่าคุณมีฟังก์ชันเช็คซ้ำอยู่แล้ว หรือเช็คจากข้อมูลที่มี)
        // ตัวอย่างเช่น เช็คกับ M_value ที่มีอยู่
        const isDuplicate =
            M_value && Object.keys(M_value).includes(value.trim());

        if (isDuplicate) {
            setErrorMessage("This field name already exists.");
        } else {
            setErrorMessage(""); // ถ้าผ่านหมดเคลียร์ error ให้หายไป
        }
    }
    return (
        <>
            <div className="tab-content-header">
                <label className="tch-label">
                    M_Class_Name = {M_Class_Name}
                </label>
                <input
                    type="text"
                    className="input_fieldname"
                    placeholder="new field name"
                    value={inputFieldname}
                    onChange={(e) => handleFieldnameChange(e.target.value)}
                />

                {/* แสดง error ใกล้ๆ text box (ถ้ามีข้อความ error ถึงจะเรนเดอร์ขึ้นมา) */}
                {errorMessage && (
                    <span className="error-text">{errorMessage}</span>
                )}

                <button
                    className="add-button"
                    onClick={add_field}
                    disabled={!inputFieldname || errorMessage} // ล็อกปุ่มถ้ายังว่างหรือมี error
                >
                    ADD FIELD
                </button>
            </div>

            <div className="input-engine-container">
                {Object.entries(M_value).map(
                    ([fieldname, field_data], index) => {
                        // SAVE TO Javascript GLOBAL Variable
                        // Dropdown_D run D_HEAL only after refresh and activeTab = app_data
                        if (
                            !window.D_HEAL.isLastField &&
                            activeTab === "app_data"
                        ) {
                            let isLastField =
                                index === Object.entries(M_value).length - 1;
                            window.D_HEAL.isLastField = isLastField;
                            // console.log(
                            //     " TabContent - window.D_HEAL.isLastField = ",
                            //     window.D_HEAL.isLastField,
                            // );
                        }
                        // !!! MUST HAVE return to show DOM !!!
                        return render_TabContent_DOM(fieldname, field_data);
                    },
                )}
            </div>
        </>
    );
}
