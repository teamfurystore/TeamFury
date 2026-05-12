import { useEffect, useState } from "react";

/**
 * Fetches the live count of active products from /api/shop/products.
 * Returns null while loading, and the count once resolved.
 */
export function useAccountsAvailable(): number | null {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/shop/products")
            .then((r) => r.json())
            .then((json) => {
                if (json.success && Array.isArray(json.data)) {
                    setCount(json.data.length);
                }
            })
            .catch(() => { });
    }, []);

    return count;
}
