import { expect, test } from "@playwright/test";

test("home renders with the studio name and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Uroko");
  await expect(page.getByRole("button", { name: /sound off/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test("sound stays off until the toggle is pressed", async ({ page }) => {
  const audio: string[] = [];
  page.on("request", (r) => /\/audio\//.test(r.url()) && audio.push(r.url()));
  await page.goto("/");
  await page.waitForTimeout(500);
  expect(audio).toHaveLength(0);
  const toggle = page.getByRole("button", { name: /sound off/i });
  await toggle.click();
  await expect(page.getByRole("button", { name: /sound on|starting/i })).toBeVisible();
  await expect.poll(() => audio.length).toBeGreaterThan(0);
});

test("motif filters live in the URL and the panel opens and closes", async ({ page }) => {
  await page.goto("/motifs");
  const chip = page.getByRole("button", { name: "Guardians" });
  await chip.scrollIntoViewIfNeeded();
  await chip.click();
  await expect(page).toHaveURL(/c=guardian/);
  await expect(page.getByText(/5 motifs/)).toBeVisible();
  await page.getByRole("link", { name: /Hannya/ }).first().click();
  await expect(page).toHaveURL(/\/motifs\/hannya$/);
  const panel = page.locator("dialog.panel");
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/c=guardian/);
});

test("a motif deep link renders as a full page", async ({ page }) => {
  await page.goto("/motifs/koi");
  await expect(page.locator("dialog.panel")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Koi");
  // The plate faces front; the on-skin photo sits on the back of the same card
  await expect(page.locator('img[alt="Koi (鯉) tattoo design"]')).toBeVisible();
  await expect(page.locator('img[alt^="Koi tattoo, healed, on"]')).toHaveCount(1);
});

test("booking runs end to end with a demo deposit", async ({ page }) => {
  await page.goto("/book?artist=sho&motif=tora");
  await expect(page.locator('input[name="artist"][value="sho"]')).toBeChecked();
  await expect(page.locator("#motif")).toHaveValue("tora");
  await page.getByLabel("Name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email").fill("test@example.com");
  await page.locator("#placement").selectOption("Thigh");
  await page.getByText("Large", { exact: true }).click();
  // The radio is visually hidden; its wrapping label is the click target.
  await page.locator('label:has(input[name="slot"]:not(:disabled))').first().click();
  await page.getByLabel(/20 or over/).check();
  await page.getByRole("button", { name: /continue to deposit/i }).click();

  await expect(page).toHaveURL(/\/book\/deposit/);
  await expect(page.getByText(/nothing is charged/i).first()).toBeVisible();
  await page.getByLabel("Name on card").fill("Test Visitor");
  await page.getByLabel("Card number").fill("4242 4242 4242 4242");
  await page.getByLabel("Expiry").fill("12 / 30");
  await page.getByLabel("CVC").fill("123");
  await page.getByRole("button", { name: /deposit \(demo\)/i }).click();

  await expect(page).toHaveURL(/\/book\/confirmed/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("See you at the studio");
  const ics = await page.request.get("/book/confirmed/ics");
  expect(ics.status()).toBe(200);
  expect(await ics.text()).toContain("BEGIN:VEVENT");
});

async function reachDeposit(page: import("@playwright/test").Page) {
  await page.goto("/book?artist=sho&motif=tora");
  await page.getByLabel("Name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email").fill("test@example.com");
  await page.locator("#placement").selectOption("Thigh");
  await page.getByText("Large", { exact: true }).click();
  await page.locator('label:has(input[name="slot"]:not(:disabled))').first().click();
  await page.getByLabel(/20 or over/).check();
  await page.getByRole("button", { name: /continue to deposit/i }).click();
  await expect(page).toHaveURL(/\/book\/deposit/);
}

test("the demo deposit refuses real card numbers and sends nothing", async ({ page }) => {
  await reachDeposit(page);
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.postData() ?? "");
  });
  await page.getByLabel("Name on card").fill("Test Visitor");
  await page.getByLabel("Card number").fill("4111 1111 1111 1111"); // valid format, not a published test card
  await page.getByLabel("Expiry").fill("12 / 30");
  await page.getByLabel("CVC").fill("123");
  await page.getByRole("button", { name: /deposit \(demo\)/i }).click();
  await expect(page.getByText(/real cards are not accepted/i).first()).toBeVisible();
  await expect(page).toHaveURL(/\/book\/deposit/);
  expect(posts).toHaveLength(0);
});

test("with a test card only the last four digits leave the browser", async ({ page }) => {
  await reachDeposit(page);
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.postData() ?? "");
  });
  await page.getByLabel("Name on card").fill("Test Visitor");
  await page.getByLabel("Card number").fill("4242 4242 4242 4242");
  await page.getByLabel("Expiry").fill("12 / 30");
  await page.getByLabel("CVC").fill("987");
  await page.getByRole("button", { name: /deposit \(demo\)/i }).click();
  await expect(page).toHaveURL(/\/book\/confirmed/);
  const sent = posts.join(" ");
  expect(sent).toContain("4242");
  expect(sent).not.toContain("4242424242424242");
  expect(sent).not.toContain("4242 4242");
  expect(sent).not.toContain("987");
  expect(sent).not.toContain("12 / 30");
});

test("booking validation rejects an empty form", async ({ page }) => {
  await page.goto("/book");
  await page.getByRole("button", { name: /continue to deposit/i }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  await expect(page).toHaveURL(/\/book$/);
});

test("tracker lookup finds a piece and rejects an unknown one", async ({ page }) => {
  await page.goto("/pieces");
  await page.getByLabel("Piece reference").fill("ur-24-0031");
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page).toHaveURL(/\/pieces\/UR-24-0031/);
  await expect(page.getByText("11/18")).toBeVisible();

  await page.goto("/pieces");
  await page.getByLabel("Piece reference").fill("UR-00-0000");
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "No piece found" })).toBeVisible();
});

test("metadata routes respond", async ({ request }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/opengraph-image", "/motifs/ryu/opengraph-image"]) {
    const r = await request.get(path);
    expect(r.status(), path).toBe(200);
  }
  const home = await request.get("/");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
});
