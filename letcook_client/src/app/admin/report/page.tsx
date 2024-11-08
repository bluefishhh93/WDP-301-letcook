"use client";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadcrumbTitle from "../component/Breadcrumb";
import { createColumns } from "./columns";
import { DataTable } from "./data-table";

type ReportData = {
  recipeId: string;
  title: string | null;
  reportCount: number;
};

export default function Report() {
  const [data, setData] = useState<ReportData[]>([]);

  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await axios.get("/api/recipe/reports");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetching();
  }, []);

  return (
    <>
      <BreadcrumbTitle title="Recipe Reports" />
      <ReportTable data={data} />
      <ToastContainer />
    </>
  );
}

const ReportTable = ({ data }: { data: ReportData[] }) => {
  const columns = createColumns();
  return <DataTable columns={columns} data={data} />;
};
