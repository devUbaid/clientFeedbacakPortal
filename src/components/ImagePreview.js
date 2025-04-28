import React, { useState } from "react"
import "./ImagePreview.css"

const ImagePreview = ({ file, onRemove }) => {
  const [preview, setPreview] = useState(null)

  // Create preview URL when file changes
  React.useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  if (!file) {
    return null
  }

  return (
    <div className="image-preview">
      <img src={preview || "/placeholder.svg"} alt="Preview" className="preview-image" />
      <button type="button" className="remove-button" onClick={onRemove} aria-label="Remove image">
        ×
      </button>
    </div>
  )
}

export default ImagePreview
