import React, { Suspense } from "react";

import { AdminLayoutClient } from "@/components/layout/AdminLayoutClient";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            <AdminLayoutClient>{children}</AdminLayoutClient>
        </Suspense>
    );
}
