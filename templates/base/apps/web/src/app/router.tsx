import { routeTree } from "@/routeTree.gen";
import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./query-client";

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Let React Query decide whether preloaded data is stale.
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
