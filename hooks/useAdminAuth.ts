"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Patches the global fetch for the lifetime of the admin dashboard.
 * Any 401 response from an /api/admin/* or /api/products* route
 * clears the auth cookie and redirects to /admin.
 *
 * Mount this once in the dashboard layout.
 */
export function useAdminAuth() {
    const router = useRouter();

    useEffect(() => {
        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
            const response = await originalFetch(...args);

            if (response.status === 401) {
                // Determine the URL that returned 401
                const url = typeof args[0] === "string"
                    ? args[0]
                    : args[0] instanceof Request
                        ? args[0].url
                        : "";

                const isAdminApi =
                    url.includes("/api/admin") ||
                    url.includes("/api/products") ||
                    url.includes("/api/contact") ||
                    url.includes("/api/reviews");

                if (isAdminApi) {
                    // Clear the auth cookie
                    document.cookie = "sb-access-token=; path=/; max-age=0";
                    router.replace("/admin");
                }
            }

            return response;
        };

        // Restore original fetch when the layout unmounts (user logs out normally)
        return () => {
            window.fetch = originalFetch;
        };
    }, [router]);
}
