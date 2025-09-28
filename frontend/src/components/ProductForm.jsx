import { useState } from "react";
import axios from "axios";
import API_URL from "../service/api";
import {
  Upload,
  DollarSign,
  Package,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

const ProductForm = ({ onProductCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "El precio debe ser mayor a 0";
    if (!formData.stock || formData.stock < 0)
      newErrors.stock = "El stock no puede ser negativo";
    if (!formData.description.trim())
      newErrors.description = "La descripción es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("description", formData.description);

      if (image) data.append("image", image);

      await axios.post(`${API_URL}/products`, data);

      onProductCreated();
      // Limpia el formulario
      setFormData({ name: "", price: "", stock: "", description: "" });
      setImage(null);
      setImagePreview(null);
      setErrors({});
    } catch (err) {
      console.error("Error creating product:", err);
      if (err.response?.data?.error) {
        setErrors({ submit: err.response.data.error });
      } else {
        setErrors({
          submit: "Error al crear el producto. Intenta nuevamente.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (fieldName) => `
    mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
    ${
      errors[fieldName]
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400"
    }
  `;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      encType="multipart/form-data"
    >
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Package className="h-4 w-4 mr-2 text-gray-500" />
              Nombre del Producto
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClasses("name")}
              placeholder="Ej: iPhone 15 Pro Max"
              required
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={inputClasses("price")}
                placeholder="0.00"
                required
              />
              {errors.price && (
                <p className="mt-1 text-red-500 text-xs">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Package className="h-4 w-4 mr-2 text-gray-500" />
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className={inputClasses("stock")}
                placeholder="0"
                required
              />
              {errors.stock && (
                <p className="mt-1 text-red-500 text-xs">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputClasses("description")}
              rows="4"
              placeholder="Describe las características principales del producto..."
              required
            />
            {errors.description && (
              <p className="mt-1 text-red-500 text-xs">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Columna derecha - Imagen */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
            Imagen del Producto
          </label>
          <div className="mt-1">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-48 w-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Sube una imagen</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP hasta 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Creando...
            </>
          ) : (
            <>
              <Package className="h-5 w-5 mr-2" />
              Crear Producto
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
