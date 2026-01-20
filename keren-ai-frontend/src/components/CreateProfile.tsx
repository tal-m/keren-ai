import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type ProfileFormData = {
  firstName: string;
  country: string;
  city: string;
  bio: string;
  instagram: string;
  tiktok: string;
};

const CreateProfile: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>();

  const navigate = useNavigate();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        "http://localhost:4003/api/connectors/me",
        {
          firstName: data.firstName,
          country: data.country,
          city: data.city,
          bio: data.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        navigate("/discovery");
      }
    } catch (error) {
      console.error("Profile creation failed:", error);
      alert("Error creating profile. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 mt-10">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Create Your Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-md px-3 py-2"
            {...register("firstName", { required: "First Name is required" })}
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Country</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-md px-3 py-2"
            {...register("country", { required: "Country is required" })}
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-md px-3 py-2"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            className="mt-1 w-full border rounded-md px-3 py-2"
            rows={3}
            {...register("bio", { required: "Bio is required" })}
          />
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          {isSubmitting ? "Creating..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;
