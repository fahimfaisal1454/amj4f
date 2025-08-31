import { useState, useEffect } from "react";
import AxiosInstance from "../../Components/AxiosInstance/AxiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../Providers/UserProvider";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [institutionLogo, setInstitutionLogo] = useState(null);
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  // Fetch institution data
  useEffect(() => {
    const fetchInstitutionData = async () => {
      try {
        const response = await AxiosInstance.get("institutions/");
        // Assuming the API returns an array and we want the first institution's logo
        if (response.data.length > 0 && response.data[0].logo) {
          setInstitutionLogo(response.data[0].logo);
        }
      } catch (error) {
        console.error("Error fetching institution data:", error);
      }
    };

    fetchInstitutionData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await AxiosInstance.post("token/", form);
      localStorage.setItem("access_token", res.data.access);
      
      // Wait for user data to be refreshed before navigating
      await refreshUser();
      
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err.response?.data);
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 mb-12 p-5 shadow-lg border border-gray-300 rounded-md bg-white dark:bg-gray-900">
      <Toaster />

      <h2 className="text-xl font-semibold text-center mb-4 text-gray-700 dark:text-gray-200">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-black dark:text-gray-300">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="john_doe"
            className="mt-1 w-full px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring focus:ring-amber-200 dark:bg-gray-800 dark:text-gray-200 dark:border-black"
          />
        </div>

        <div>
          <label className="block text-sm text-black dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="********"
              className="mt-1 w-full px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 placeholder-gray-400 pr-10 focus:outline-none focus:ring focus:ring-amber-200 dark:bg-gray-800 dark:text-gray-200 dark:border-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff size={18} className="text-black" />
              ) : (
                <Eye size={18} className="text-black" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-sm bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-black dark:text-gray-300">
        Don't have an account?{" "}
        <Link to="/register" className="text-black hover:underline font-medium">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
