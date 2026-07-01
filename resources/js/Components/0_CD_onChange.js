//0_CD_onChange.js

export function CD_onChange(option, isChecked, setStates) {
    switch (option) {
        case "DEFAULT":
            setStates.set_DEFAULT(isChecked);
            break;
        case "REQUIRED":
            setStates.set_REQUIRED(isChecked);
            if (isChecked) setStates.set_NULLABLE(false);
            break;
        case "NULLABLE":
            setStates.set_NULLABLE(isChecked);
            if (isChecked) setStates.set_REQUIRED(false);
            break;
        case "UNIQUE":
            setStates.set_UNIQUE(isChecked);
            break;
    }
}
