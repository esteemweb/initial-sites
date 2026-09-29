const TZ = "Asia/Tokyo";

export const yen = (n: number) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(n);

export const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T12:00:00+09:00`),
  );

export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "numeric", month: "short" }).format(new Date(`${iso}T12:00:00+09:00`));
