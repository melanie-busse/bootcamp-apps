import { initialColors } from "./lib/colors";
import "./App.css";

import AddColorForm from "./Components/Form/AddColorForm.jsx"
import "./Components/Form/AddColorForm.css";

import Color from "./Components/Color/Color";
import "./Components/Color/Color.css";

import useLocalStorageState from "use-local-storage-state";

function App() {
    const [colors, setColors] = useLocalStorageState("colors", {defaultValue: initialColors});
    const [isFormVisible, setIsFormVisible] = useLocalStorageState("isFormVisible", {defaultValue: false});
    const [selectedColor, setSelectedColor] = useLocalStorageState("selectedColor", {defaultValue: null});

    function editColor(id) {
        const color = colors.find(c => c.id === id);
        setSelectedColor(color);
        setIsFormVisible(false);
    }

    function deleteColor(id) {
        const colorHex = colors.find(c => c.id === id)?.hex || 'diese Farbe';
        const confirm = window.confirm(
            `Do you really want to delete the color "${colorHex}"?\nThis action cannot be undone.`
        );

        if(confirm) {
            setColors(colors.filter(c => c.id !== id));
        }
    }

    return (
        <>
            <div className="header-section">
                <h1 className="theme-title">
                    Default Theme
                </h1>
                <button
                    className="button add-button"
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    tabIndex={-1}
                >
                    {isFormVisible ? '➖' : '➕'}
                </button>
            </div>

            {isFormVisible && (
                <div className="formAddButton">
                    <AddColorForm
                        colors = {colors}
                        setColors = {setColors}
                        setIsFormVisible = {setIsFormVisible}
                        selectedColor = {null}
                        isEditMode = {false}
                    />
                </div>
            )}

            <div className="colors-grid">
                {colors.length === 0 ? (
                    <div className="empty-state">
                        No colors yet. ➕ Add your first color!
                    </div>
                ) : (
                    colors.map(({id, hex, role, contrastText}) => (
                        <Color
                            key = {id}
                            id = {id}
                            color = {hex}
                            role = {role}
                            contrastText = {contrastText}
                            selectedColor = {selectedColor?.id === id ?
                                {id, hex, role, contrastText} :
                                null}
                            colors = {colors}
                            setColors = {setColors}
                            onEdit = {editColor}
                            onDelete = {deleteColor}
                        />
                    ))
                )}
            </div>
        </>
    );
}
export default App;