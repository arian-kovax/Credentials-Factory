import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { fetchCurrentUser } from "../../services/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!user) {
      fetchCurrentUser().catch(() => {
        setError("We couldn't load your profile details.");
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-inputBg px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-card bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-textMuted">Authenticated Session</p>
            <h1 className="mt-2 text-3xl font-semibold text-textPrimary">
              Dashboard
            </h1>
            <p className="mt-3 text-sm text-textMuted">
              Your account is authenticated through the Django JWT API and this
              route is protected by the React auth flow.
            </p>
          </div>

          <Button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-field border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-textMuted">
              Username
            </p>
            <p className="mt-2 text-sm text-textPrimary">
              {user?.username ?? "Loading..."}
            </p>
          </div>
          <div className="rounded-field border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-textMuted">
              Email
            </p>
            <p className="mt-2 text-sm text-textPrimary">
              {user?.email ?? "Loading..."}
            </p>
          </div>
          <div className="rounded-field border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-textMuted">
              Phone
            </p>
            <p className="mt-2 text-sm text-textPrimary">
              {user?.phone ?? "Loading..."}
            </p>
          </div>
          <div className="rounded-field border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-textMuted">
              Department
            </p>
            <p className="mt-2 text-sm text-textPrimary">
              {user?.department ?? "Loading..."}
            </p>
          </div>
          <div className="rounded-field border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-textMuted">
              Access level
            </p>
            <p className="mt-2 text-sm text-textPrimary">
              {user?.access_level ?? "Loading..."}
            </p>
          </div>
          <div className="rounded-field border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-textMuted">
              Staff access
            </p>
            <p className="mt-2 text-sm text-textPrimary">
              {user?.is_staff ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {error ? (
          <p className="mt-6 text-sm text-red-500">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
