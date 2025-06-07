import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ContentProp } from "./search/columns";
import { toast } from "sonner";
import Searching from "./search/searching";

const SearchCustomer = () => {
  const [content, setContent] = useState<ContentProp[] | null>(null);

  useEffect(() => {
    handleInitialFetch();
  }, []);

  const handleInitialFetch = () => {
    axios
      .get(`/api/transition/getby-without-licence?email=&postal=&medic=`)
      .then((res) => {
        console.log(res.data);
        setContent(res.data.transitions);
      })
      .catch((err) => {
        setContent([]);
        console.log(err);
        toast.error(
          err.response.data.message || err.response.data.error || err.message
        );
      });
  };

  const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    const form = e.currentTarget;
    const formData = new FormData(form);
    axios
      .get(
        `/api/transition/getby-without-licence?email=${formData.get(
          "email"
        )}&postal=${formData.get("postal")}&medic=${formData.get("medic")}`
      )
      .then((res) => {
        console.log(res.data);
        setContent([...res.data.transitions]);
      })
      .catch((err) => {
        setContent([]);
        console.log(err);
        toast.error(
          err.response.data.message || err.response.data.error || err.message
        );
      });
  };
  return (
    <>
      <div className="w-full py-8 px-4 rounded-xl">
        <div className="flex flex-col gap-4 items-center">
          <form
            onSubmit={handleSearchClick}
            className="w-full max-w-4xl space-y-3"
          >
            <label
              htmlFor="search"
              className="block text-lg font-semibold text-gray-800 text-center"
            >
              🔍 Advanced Search Customer by E-mail, Medication & Postal Code
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <input
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                type="email"
                name="email"
                placeholder="hello@user.com"
              />
              <input
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                type="number"
                name="postal"
                placeholder="Postal Code"
              />
              <input
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                type="text"
                name="medic"
                placeholder="Medication"
              />
              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition duration-200 cursor-pointer"
              >
                <Search className="h-5 w-5 mr-1" />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <Searching content={content} />
    </>
  );
};

export default SearchCustomer;
