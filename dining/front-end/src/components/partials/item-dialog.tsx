import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  //   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useEffect, useState } from "react";

interface MenuItem {
  _id: string; // changed from id: number to _id: string
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
}

const ItemDialog = ({
  isOpen,
  edit,
  categoryId,
  closeDialog,
}: {
  isOpen: boolean;
  edit: MenuItem | null;
  categoryId: string;
  closeDialog: () => void;
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    description: string;
    category: string;
    image: File | null;
  }>({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    if (edit) {
      setFormData({ ...edit, image: null });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        image: null,
      });
    }
  }, [edit]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "category") {
      console.log("Selected category:", name, value);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", categoryId);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (edit) {
        // Editing an existing item
        const res = await axios.put(`/api/menu/update/item/${edit._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);
      } else {
        // Adding new item
        const res = await axios.post(`/api/menu/create/item`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);
      }

      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        image: null,
      });
    } catch (err) {
      console.error("Failed to add/edit item", err);
    }
  };
  return (
    <AlertDialog open={isOpen}>
      {/* <AlertDialogTrigger >Open</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <form
            onSubmit={handleFormSubmit}
            className="mt-8 p-6 max-w-md border rounded shadow-md bg-white"
          >
            <h3 className="text-lg font-bold mb-4">
              {edit ? "Edit Item" : "Create New Item"}
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="text"
              name="price"
              placeholder="Item Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-3 p-2 border rounded"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
            ></textarea>

            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              {edit ? "Update Item" : "Add Item"}
            </button>
          </form>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ItemDialog;
