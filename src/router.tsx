import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  const origGetMatchedRoutes = router.getMatchedRoutes.bind(router);
  (router as any).getMatchedRoutes = (pathname: string) => {
    const res: any = origGetMatchedRoutes(pathname);
    if (res && typeof res === "object" && !res[Symbol.iterator]) {
      res[Symbol.iterator] = function* () {
        yield res.matchedRoutes;
        yield res.routeParams ?? res.rawParams;
        yield res.foundRoute;
      };
    }
    return res;
  };

  let _serverSsr: any = undefined;
  Object.defineProperty(router, "serverSsr", {
    configurable: true,
    enumerable: true,
    get() {
      return _serverSsr;
    },
    set(val) {
      if (val && typeof val === "object") {
        if (typeof val.takeBufferedScripts !== "function") {
          val.takeBufferedScripts = () => undefined;
        }
        if (typeof val.reserveStreamFastPath !== "function") {
          val.reserveStreamFastPath = () => false;
        }
        if (typeof val.liftScriptBarrier !== "function") {
          val.liftScriptBarrier = () => {};
        }
        if (typeof val.onSerializationFinished !== "function") {
          val.onSerializationFinished = () => {};
        }
        if (typeof val.isSerializationFinished !== "function") {
          val.isSerializationFinished = () => true;
        }
      }
      _serverSsr = val;
    },
  });

  return router;
};
