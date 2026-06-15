import {useState, useEffect} from 'react';

function ColorCardCheck({ bgColor, textColor, onContrastUpdate }) {
    const [contrastResult, setContrastResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkContrast = async () => {
        const safeBg = (bgColor || '#000000').toLowerCase();
        const safeText = (textColor || '#ffffff').toLowerCase();

        if (!safeBg || !safeText) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('https://www.aremycolorsaccessible.com/api/are-they', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ colors: [safeText, safeBg] }),
            });

            const data = await response.json();

            const cleanData = {
                Overall: data.overall || data.Overall || 'Nope',
                Contrast: data.contrast || data.Contrast || '0:1'
            };

            setContrastResult(cleanData);
            onContrastUpdate?.(cleanData);
        } catch (err) {
            setContrastResult({ Overall: 'Error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bgColor && textColor) {
            const quickFail = bgColor.toLowerCase() === textColor.toLowerCase();
            if (quickFail) {
                setContrastResult({ Overall: 'Nope' });
                return;
            }

            checkContrast();
        }
    }, [bgColor, textColor]);


    return (
        <div className="contrast-container">
            <span className="formAddButton__label">Overall Constract Score:</span>

            {loading ? (
                <span className="loading-text">loading...</span>
            ) : contrastResult?.Overall ? (
                <>
                    {contrastResult.Overall === 'Yup' && (
                        <span
                            role="img"
                            aria-label="WCAG AAA/AA konform"
                            className="icon-yup"
                            aria-hidden="true"
                        >
                            ✅
                        </span>
                    )}
                    {contrastResult.Overall === 'Kinda' && (
                        <span
                            role="img"
                            aria-label="Teilkonform WCAG AA Large"
                            className="icon-kinda"
                            aria-hidden="true"
                        >
                            ⚠️
                        </span>
                    )}
                    {contrastResult.Overall === 'Nope' && (
                        <span
                            role="img"
                            aria-label="Nicht WCAG konform"
                            className="icon-nope"
                            aria-hidden="true"
                        >
                            ❌
                        </span>
                    )}
                </>
            ) : (
                <span className="no-data-text">no data</span>
            )}
        </div>
    );
}

export default ColorCardCheck;