import { useState, useRef, useEffect } from "react";
import ColorCardCheck from "../ColorCardCheck/ColorCardCheck.jsx";
import "../ColorCardCheck/ColorCardCheck.css";

export default function AddColorForm({
                                         colors,
                                         setColors,
                                         setIsFormVisible,
                                         selectedColor,
                                         isEditMode = false,
                                         onCancel,
                                     }) {
    const DEFAULT_ROLE = "primary";
    const DEFAULT_HEX = "#000000";
    const DEFAULT_CONTRAST_TEXT = "#ffffff";

    const [role, setRole] = useState(DEFAULT_ROLE);
    const [hex, setHex] = useState(DEFAULT_HEX);
    const [contrastText, setContrastText] = useState(DEFAULT_CONTRAST_TEXT);

    const roleRef = useRef(null);
    const hexRef = useRef(null);
    const contrastRef = useRef(null);
    const submitRef = useRef(null);
    const colorRef = useRef(null);
    const hexColorRef = useRef(null);

    useEffect(() => {
        if (isEditMode && selectedColor) {
            setRole(selectedColor.role || DEFAULT_ROLE);
            setHex(selectedColor.hex ||  DEFAULT_HEX);
            setContrastText(selectedColor.contrastText || DEFAULT_CONTRAST_TEXT);
        } else {
            setRole(DEFAULT_ROLE);
            setHex(DEFAULT_HEX);
            setContrastText(DEFAULT_CONTRAST_TEXT);
        }
    }, [isEditMode, selectedColor]);


    function updateHex(event) {
        setHex(event.target.value);
    }

    function updateContrastText(event) {
        setContrastText(event.target.value);
    }

    function updateRole(event) {
        setRole(event.target.value);
    }

    function addColor(event) {
        event.preventDefault();

        const newColor = { id: crypto.randomUUID(), role, hex, contrastText };
        setColors([newColor, ...colors]);
        submitRef.current?.blur();

        if (setIsFormVisible) {
            setIsFormVisible(false);
        }

        if (onCancel) {
            onCancel();
        }
    }

    function updateColor(event) {
        event.preventDefault();

        if (!selectedColor?.id) {
            return;
        }

        const updatedColor = { id: selectedColor.id, role, hex, contrastText };
        setColors(colors.map(c => c.id === selectedColor.id ? updatedColor : c));
        submitRef.current?.blur();

        if (onCancel) {
            onCancel();
        }
    }

    const handleSubmit = isEditMode ? updateColor : addColor;
    const buttonText = isEditMode ? "✎ Update Color" : "➕ Add Color";

    return (
        <form onSubmit={handleSubmit}>
            <label className="formAddButton__label">
                {isEditMode ? 'Edit' : 'New'} Role
            </label>
            <input
                ref={roleRef}
                id="role"
                name="role"
                type="text"
                value={role}
                onChange={updateRole}
                placeholder={role}
                onFocus={() => roleRef.current?.select()}
                className="formAddButton__input"
            />

            <label className="formAddButton__label">
                {isEditMode ? 'Edit' : 'New'} Hex
            </label>
            <div className="formAddButton__input-row">
                <input
                    ref={hexRef}
                    id="hex"
                    name="hex"
                    type="text"
                    value={hex}
                    onChange={updateHex}
                    placeholder={hex}
                    onFocus={() => hexRef.current?.select()}
                    className="formAddButton__input"
                />
                <div className="form-input-wrapper">
                    <div className="custom-color-picker">
                        <input
                            type="color"
                            name="hexcolor"
                            value={hex}
                            onChange={updateHex}
                            className="hidden-color-input"
                            ref={hexColorRef}
                        />
                        <div
                            className="color-preview-base"
                            style={{ background: hex }}
                            onClick={() => hexColorRef.current?.click()}
                            title="change >hex color"
                        />
                    </div>
                </div>
            </div>

            <label className="formAddButton__label">
                {isEditMode ? 'Edit' : 'New'} Contrast Text
            </label>
            <div className="formAddButton__input-row">
                <input
                    ref={contrastRef}
                    id="contrasttext"
                    name="contrasttext"
                    type="text"
                    value={contrastText}
                    onChange={updateContrastText}
                    placeholder={contrastText}
                    onFocus={() => contrastRef.current?.select()}
                    className="formAddButton__input"
                />
                <div className="form-input-wrapper">
                    <div className="custom-color-picker">
                        <input
                            type="color"
                            name="contrast-textcolor"
                            value={contrastText}
                            onChange={updateContrastText}
                            className="hidden-color-input"
                            ref={colorRef}
                        />
                        <div
                            className="color-preview"
                            style={{
                                backgroundColor: contrastText,
                                backgroundImage: 'none',
                                background: contrastText,
                                height: '35px',
                                padding: '0.75rem 1rem',
                                border: 'var(--border-input)',
                                borderRadius: 'var(--border-radius)',
                                boxSizing: 'border-box',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={() => colorRef.current?.click()}
                            title="change text color"
                        />
                    </div>
                </div>
            </div>
            <ColorCardCheck
                bgColor={hex}
                textColor={contrastText}
            />
            <button
                ref={submitRef}
                type="submit"
                className="formAddButton__input formAddButton__input--submit"
            >
                {buttonText}
            </button>
        </form>
    );
}