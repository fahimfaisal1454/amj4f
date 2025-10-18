import React from "react";
import DashboardLayout from "./DashboardLayout";
import { useApiQuery } from "../api/hooks";
import { ENDPOINTS } from "../api/endpoints";

export default function AdminHome() {
  const banners = useApiQuery(ENDPOINTS.banners, []);
  const news = useApiQuery(ENDPOINTS.news, []);
  const programs = useApiQuery(ENDPOINTS.programs, []);
  const stories = useApiQuery(ENDPOINTS.stories, []);

  const Card = ({ title, count }) => (
    <div className="rounded border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold">{count ?? "…"}</div>
    </div>
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-pactPurple mb-4">Overview</h1>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card title="Banners" count={banners.data?.length} />
        <Card title="News" count={news.data?.length} />
        <Card title="Programs" count={programs.data?.length} />
        <Card title="Stories" count={stories.data?.length} />
      </div>
      <p className="mt-6 text-gray-600">Use the sidebar to manage content.</p>
    </DashboardLayout>
  );
}
