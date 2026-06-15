import AddColorForm from "../Form/AddColorForm.jsx";

export default function Color({ color, role, contrastText, id, selectedColor, colors, setColors, onDelete, onEdit }) {
    const isEditing = !!selectedColor;
    const borderStyle = `4px solid ${color}`;

    if (!isEditing) {
        return (
            <div
                className="color-card"
                style={{
                    backgroundColor: color,
                    color: contrastText,
                    border: borderStyle
                }}
            >
                <div className="color-display" tabIndex={-1}>
                    <div className="color-hex" data-content={color} tabIndex={-1}>
                        {color}
                    </div>
                </div>

                <div className="color-role" tabIndex={-1}>
                    {role || "primary"}
                </div>
                <div className="color-contrast" tabIndex={-1}>
                    contrast: {contrastText || "white"}
                </div>
                <div className="container">
                    <div className="button-group">
                        <button
                            className="button"
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(color);
                                } catch (err) {
                                    console.error('Clipboard error:', err);
                                }
                            }}
                            title="Copy color"
                            aria-label="Copy color"
                        >
                            📋
                        </button>
                        <button
                            className="button"
                            onClick={() => onEdit(id)}
                            aria-label="change color"
                        >
                            ✎
                        </button>
                        <button
                            className="button"
                            onClick={() => onDelete(id)}
                            aria-label="delete Color"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="formAddButton">
            <div className="edit-header">
                <h3>Edit Color</h3>
                <button
                    className="button close-edit-button"
                    onClick={() => onEdit(null)}
                >
                    ❌
                </button>
            </div>

            <AddColorForm
                colors = {colors}
                setColors = {setColors}
                selectedColor = {selectedColor}
                isEditMode = {true}
                onCancel = {() => onEdit(null)}
            />
        </div>
    );
}