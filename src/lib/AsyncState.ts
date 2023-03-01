export type AsyncState<T> =
  | {
      id: "idle";
      data?: undefined;
      error?: undefined;
    }
  | {
      id: "pending";
      data?: undefined;
      error?: undefined;
    }
  | {
      id: "success";
      data: T;
      error?: undefined;
    }
  | {
      id: "fetching";
      data: T;
      error?: undefined;
    }
  | {
      id: "error";
      error: unknown;
      data?: undefined;
    };
