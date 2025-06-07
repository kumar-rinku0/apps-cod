import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "sonner";

const SelectCompany = () => {
  const { signIn, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [content, setContent] = useState(null);

  const handleCreateClick = () => {
    navigate("/create");
  };

  const handleSelectClick = (companyId) => {
    setSelectedCompany(companyId);
    axios
      .get(`/api/branch/user/${content._id}/company/${companyId}`)
      .then((res) => {
        console.log(res);
        const { company, roleInfo } = res.data;
        signIn({
          ...user,
          company: company,
          roleInfo: roleInfo,
        });
        toast.info(`${company.companyName} selected!`);
        if (roleInfo.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/attendance");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/user/userId/${user._id}`)
        .then((res) => {
          console.log(res);
          setContent(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="bg-gray-900 text-white p-4 w-72 rounded-lg shadow-lg">
        {content &&
          content.companyWithRole.map((value, index) => (
            <label
              key={index}
              className={`block p-4 mb-2 cursor-pointer rounded-lg ${
                selectedCompany === value.company._id
                  ? "bg-gray-700"
                  : "bg-gray-800"
              }`}
            >
              <input
                type="radio"
                name="company"
                value={value.company.companyName}
                checked={selectedCompany === value.company._id}
                onChange={() => handleSelectClick(value.company._id)}
                className="mr-2 hidden"
              />
              <div>
                <p className="font-bold">{value.company.companyName}</p>
                <p className="text-sm">Role - {value.role}</p>
              </div>
            </label>
          ))}

        <button
          onClick={handleCreateClick}
          className="w-full mt-2 p-3 bg-gray-800 rounded-lg text-left cursor-pointer"
        >
          + Create New Company
        </button>
      </div>
    </div>
  );
};

export default SelectCompany;
