import { useState, useRef, useEffect } from 'react';
import './ImageUpload.css';

const ImageUpload = ({
    value,
    onChange,
    label = 'Upload Gambar',
    accept = 'image/*',
    maxSize = 5, // MB
    multiple = false // NEW: support multiple images
}) => {
    // For single image: value is string, for multiple: value is array
    const [previews, setPreviews] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    // Initialize previews from value
    useEffect(() => {
        if (multiple) {
            setPreviews(Array.isArray(value) ? value : value ? [value] : []);
        } else {
            setPreviews(value ? [value] : []);
        }
    }, [value, multiple]);

    const handleFileSelect = (files) => {
        setError('');

        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const validFiles = [];

        for (const file of fileArray) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                setError('Semua file harus berupa gambar');
                continue;
            }

            // Check file size
            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > maxSize) {
                setError(`Ukuran file maksimal ${maxSize}MB per file`);
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        // Convert all files to base64
        const promises = validFiles.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => reject(new Error('Gagal membaca file'));
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises)
            .then(base64Array => {
                if (multiple) {
                    const newPreviews = [...previews, ...base64Array];
                    setPreviews(newPreviews);
                    onChange(newPreviews);
                } else {
                    // Single mode - just use first image
                    setPreviews([base64Array[0]]);
                    onChange(base64Array[0]);
                }
            })
            .catch(() => {
                setError('Gagal membaca beberapa file');
            });
    };

    const handleInputChange = (e) => {
        handleFileSelect(e.target.files);
        // Reset input so same file can be selected again
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleRemove = (index) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        if (multiple) {
            onChange(newPreviews);
        } else {
            onChange('');
        }
    };

    const handleRemoveAll = () => {
        setPreviews([]);
        onChange(multiple ? [] : '');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const hasImages = previews.length > 0;

    return (
        <div className={`image-upload ${multiple ? 'image-upload--multiple' : ''}`}>
            <label className="image-upload__label">{label}</label>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleInputChange}
                className="image-upload__input"
                multiple={multiple}
            />

            {hasImages ? (
                <div className="image-upload__gallery">
                    {previews.map((preview, index) => (
                        <div key={index} className="image-upload__preview-item">
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="image-upload__remove-btn"
                                title="Hapus gambar"
                            >
                                ✕
                            </button>
                            {index === 0 && (
                                <span className="image-upload__primary-badge">Utama</span>
                            )}
                        </div>
                    ))}

                    {/* Add more button for multiple mode */}
                    {multiple && (
                        <div
                            className="image-upload__add-more"
                            onClick={handleClick}
                        >
                            <span className="image-upload__add-icon">+</span>
                            <span className="image-upload__add-text">Tambah</span>
                        </div>
                    )}
                </div>
            ) : null}

            {/* Dropzone - shown when no images or always for single mode replacement */}
            {(!hasImages || !multiple) && !hasImages && (
                <div
                    className={`image-upload__dropzone ${isDragging ? 'image-upload__dropzone--active' : ''}`}
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="image-upload__icon">📁</div>
                    <p className="image-upload__text">
                        Klik untuk pilih file atau<br />
                        <strong>drag & drop</strong> gambar di sini
                    </p>
                    <p className="image-upload__hint">
                        PNG, JPG, JPEG, GIF (max {maxSize}MB)
                        {multiple && <><br />Bisa pilih beberapa gambar sekaligus</>}
                    </p>
                </div>
            )}

            {/* Actions for multiple mode when has images */}
            {hasImages && multiple && (
                <div className="image-upload__actions">
                    <button
                        type="button"
                        onClick={handleClick}
                        className="image-upload__action-btn"
                    >
                        📷 Tambah Gambar
                    </button>
                    <button
                        type="button"
                        onClick={handleRemoveAll}
                        className="image-upload__action-btn image-upload__action-btn--danger"
                    >
                        🗑️ Hapus Semua
                    </button>
                </div>
            )}

            {/* Single image replace/remove buttons */}
            {hasImages && !multiple && (
                <div className="image-upload__single-actions">
                    <button
                        type="button"
                        onClick={handleClick}
                        className="image-upload__action-btn"
                    >
                        📷 Ganti Gambar
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRemove(0)}
                        className="image-upload__action-btn image-upload__action-btn--danger"
                    >
                        🗑️ Hapus
                    </button>
                </div>
            )}

            {error && <p className="image-upload__error">{error}</p>}
        </div>
    );
};

export default ImageUpload;
