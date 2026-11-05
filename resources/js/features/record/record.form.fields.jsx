import { L, formatCurrency } from "@/i18n";
import { normalizeCurrencyInput } from "@/utils/input.utils";
import { TYPE, KEY } from "@/features/record/record.config";

export default function RecordFormFields(props) {
    const {
        form,
        errors,
        touched,
        handleBlur,
        inputRef,
        updateField,
        RECORD_FIELDS,
    } = props;

    const showError = (field) => {
        return (
            touched?.[field.key] &&
            errors?.[field.key] && (
                <p className="error-text">{errors?.[field.key]}</p>
            )
        );
    };

    const inputText = (field) => {
        return (
            <div key={field.key} className="input-group-text">
                <span>{field.label}</span>
                <input
                    ref={field.key === "name" ? inputRef : null}
                    className={`input ${
                        touched?.[field.key] && errors?.[field.key]
                            ? "input-error"
                            : ""
                    }`}
                    type={`${field.type}`}
                    value={form?.[field.key] ?? ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    onBlur={() => handleBlur(field.key)}
                />

                {showError(field)}
            </div>
        );
    };

    const inputEmail = (field) => {
        return (
            <div key={field.key} className="input-group-text">
                <span>{field.label}</span>

                <input
                    type={`${field.type}`}
                    className={`input ${
                        touched?.[field.key] && errors?.[field.key]
                            ? "input-error"
                            : ""
                    }`}
                    value={form[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    onBlur={() => handleBlur(field.key)}
                />

                {showError(field)}
            </div>
        );
    };

    const inputNumber = (field) => {
        return (
            <div key={field.key} className="input-group-numeric">
                <span>{field.label}</span>

                <div className="input-with-unit">
                    <input
                        type={`${field.type}`}
                        className={`input ${
                            touched?.[field.key] && errors?.[field.key]
                                ? "input-error"
                                : ""
                        }`}
                        value={form[field.key]}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        onBlur={() => handleBlur(field.key)}
                    />

                    <span className="value-unit">{field.unit}</span>
                </div>

                {showError(field)}
            </div>
        );
    };

    const inputCurrency = (field) => {
        const rawValue = form[field.key] ?? "";

        const isFocused = document.activeElement?.name === field.key;

        /**
         * Currency input behavior:
         * - Empty value → show nothing
         * - While typing (focused) → show raw input
         * - After blur → show formatted currency
         */
        const displayValue = rawValue
            ? isFocused
                ? rawValue
                : formatCurrency(rawValue)
            : "";

        return (
            <div key={field.key} className="input-group-numeric">
                <span>{field.label}</span>

                <div className="input-with-unit">
                    <input
                        type="tel" //for numberic keyboard on mobile
                        inputMode="decimal"
                        name={field.key}
                        className={`input ${
                            touched?.[field.key] && errors?.[field.key]
                                ? "input-error"
                                : ""
                        }`}
                        value={displayValue}
                        onFocus={() => {
                            const cleaned = String(rawValue)
                                .replace(/,/g, "") // remove commas
                                .replace(/\.0+$/, ""); // 👈 delete .00 onFocus

                            updateField(field.key, cleaned);
                        }}
                        onChange={(e) => {
                            const result = normalizeCurrencyInput(
                                e.target.value,
                            );

                            if (result === null) return;

                            updateField(field.key, result);
                        }}
                        onBlur={() => handleBlur(field.key)}
                    />

                    <span className="value-unit">{field.unit}</span>
                </div>

                {showError(field)}
            </div>
        );
    };

    const inputSelect = (field) => {
        const currentValue = form?.[field.key] ?? field.options?.[0]?.value;

        return (
            <div key={field.key} className="input-group-text">
                <span>{field.label}</span>

                <div className="toggle-group">
                    {field.options.map((option) => {
                        const isActive = currentValue === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={`btn-toggle ${isActive ? "active" : ""}`}
                                onClick={() =>
                                    updateField(field.key, option.value)
                                }
                                onBlur={() => handleBlur(field.key)}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>

                {showError(field)}
            </div>
        );
    };

    const inputBoolean = (field) => {
        const value = form?.[field.key] ?? true;

        const options = field.options ?? [
            { value: true, label: "ON" },
            { value: false, label: "OFF" },
        ];

        const current = options.find((o) => o.value === value);

        return (
            <div key={field.key} className="input-group-text">
                <span>{field.label}</span>

                <div className="switch-row">
                    <button
                        type="button"
                        className={`switch ${value ? "on" : "off"}`}
                        onClick={() => updateField(field.key, !value)}
                        onBlur={() => handleBlur(field.key)}
                    >
                        <div className="knob" />
                    </button>

                    <span className={`state-label ${value ? "on" : "off"}`}>
                        {current?.label ?? value}
                    </span>
                </div>

                {showError(field)}
            </div>
        );
    };

    return RECORD_FIELDS.map((field) => {
        /**
         * IMAGE FIELD
         */
        if (field.type === TYPE.IMAGE) return null;

        /**
         * TEXT FIELD
         */
        if (field.type === TYPE.TEXT || field.type === TYPE.PHONE) {
            return inputText(field);
        }

        /**
         * NUMBER FIELD
         */
        if (field.type === TYPE.NUMBER) {
            return inputNumber(field);
        }

        /**
         * CURRENCY FIELD
         */
        if (field.type === TYPE.CURRENCY) {
            return inputCurrency(field);
        }

        /**
         * EMAIL FIELD
         */
        if (field.type === TYPE.EMAIL) {
            return inputEmail(field);
        }

        /**
         * SELECT FIELD
         */
        if (field.type === TYPE.SELECT) {
            return inputSelect(field);
        }

        /**
         * BOOLEAN FIELD
         */
        if (field.type === TYPE.BOOLEAN) {
            return inputBoolean(field);
        }

        if (field.key === KEY.USER_ID) return null;

        return null;
    });
}
