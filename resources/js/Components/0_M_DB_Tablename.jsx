//resources/js/Components/0_M_DB_Tablename.jsx

/**
 * DB Table with DB Column in it
 * e.g.
{
    "_comment": "1_App-Data.json",
    
    ... any f::FIELDNAME ...
    
    "t": {
        "users": "users",
        "products": "products",
        "shops": "shops",
        "orders": "orders"
    }
}
*/
export default function DB_Tablename({ field_data }) {
    console.log("0_M_DB_Tablename.jsx - field_data = ", field_data);
    return (
        <input
            type="text"
            className="M_Data_VALUE"
            defaultValue={field_data}
            // onBlur={(e) => handleUpdate(fieldname, e.target.value)}
        />
    );
}
