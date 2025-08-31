import { useState } from "react";
import AxiosInstance from "../../Components/AxiosInstance/AxiosInstance";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    confirm_password: "",
    profile_picture: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await AxiosInstance.post("register/", formData);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "block mt-1 w-full text-sm rounded border border-gray-300 px-3 py-2 text-gray-700 focus:border-amber-400 focus:outline-none focus:ring focus:ring-amber-300 dark:border-black dark:bg-gray-800 dark:text-gray-300";

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow-lg border border-gray-300 rounded-md bg-white dark:bg-gray-900">
      <Toaster />
      {/* <div className="flex justify-center mb-1">
        <img src="/image.png" alt="School Logo" className="h-14" />
      </div> */}

      <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-1">
        <div>
          <label className="text-sm text-black dark:text-gray-300">Username</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} required placeholder="john_doe" className={inputStyle} />
        </div>

        <div>
          <label className="text-sm text-black dark:text-gray-300">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" className={inputStyle} />
        </div>

        <div>
          <label className="text-sm text-black dark:text-gray-300">Full Name</label>
          <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="John Doe" className={inputStyle} />
        </div>

        <div>
          <label className="text-sm text-black dark:text-gray-300">Phone</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className={inputStyle} />
        </div>

        <div>
          <label className="text-sm text-black dark:text-gray-300">Profile Picture</label>
          <input type="file" name="profile_picture" accept="image/*" onChange={handleChange} className="block w-full px-3 py-1.5 mt-1 text-sm text-black bg-white border border-gray-300 rounded file:bg-gray-200 file:text-gray-700 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 focus:border-amber-400 focus:outline-none focus:ring focus:ring-amber-300 dark:border-black dark:bg-gray-900" />
        </div>

        <div>
          <label className="text-sm text-black dark:text-gray-300">Password</label>
          <div className="relative flex items-center mt-1">
            <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required placeholder="********" className={inputStyle + " pr-10"} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2">
              {showPassword ? <EyeOff className="w-4 h-4 text-black" /> : <Eye className="w-4 h-4 text-black" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-black dark:text-gray-300">Confirm Password</label>
          <div className="relative flex items-center mt-1">
            <input type={showConfirmPassword ? "text" : "password"} name="confirm_password" value={form.confirm_password} onChange={handleChange} required placeholder="********" className={inputStyle + " pr-10"} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2">
              {showConfirmPassword ? <EyeOff className="w-4 h-4 text-black" /> : <Eye className="w-4 h-4 text-black" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition text-sm">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-black dark:text-gray-400">
        Already have an account? <Link to="/login" className="text-amber-600 hover:underline dark:text-amber-400">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
