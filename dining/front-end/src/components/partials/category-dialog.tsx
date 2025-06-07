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

interface Category {
  _id?: string;
  name: string;
  type: string;
  description: string;
  image?: string;
}

const CategoryDialog = ({
  isOpen,
  edit,
  closeDialog,
}: {
  isOpen: boolean;
  edit: Category | null;
  closeDialog: () => void;
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    type: string;
    description: string;
    image: File | null;
  }>({
    name: "",
    type: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (edit) {
      const { name, type, description } = edit;
      setFormData({ name, type, description, image: null });
    } else {
      setFormData({
        name: "",
        type: "",
        description: "",
        image: null,
      });
    }
  }, [edit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }

    const url = edit
      ? `/api/menu/update/category/${edit._id}`
      : `/api/menu/create`;

    const method = edit ? "put" : "post";

    axios({
      method,
      url,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res.data);
        setFormData({ name: "", type: "", description: "", image: null });
        closeDialog();
      })
      .catch((err) => {
        console.error("Failed to save category", err);
      });
  };

  return (
    <AlertDialog open={isOpen}>
      {/* <AlertDialogTrigger >Open</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Category</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <form
            onSubmit={handleFormSubmit}
            className="mt-8 p-6 max-w-md border rounded shadow-md bg-white"
          >
            <h3 className="text-lg font-bold mb-4">
              {edit ? "Edit Category" : "Create New Category"}
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Category Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="text"
              name="type"
              placeholder="Category Type"
              value={formData.type}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
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
              disabled={!formData.name}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {edit ? "Update Category" : "Add Category"}
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

export default CategoryDialog;
