// Ruang Pro launch config. When the owner's payment account exists, paste
// the checkout link into CHECKOUT_URL — the pricing section on /welcome
// switches from "founding window" copy to a live buy button automatically.
// Until then nothing is gated: sync is free for founding users, truthfully.
export const PRO = {
  price: "$19",
  period: "once, forever",
  checkoutUrl: "", // e.g. Gumroad / Lemon Squeezy product link
  // License verification endpoint — fill together with checkoutUrl.
  // Lemon Squeezy: { url: "https://api.lemonsqueezy.com/v1/licenses/validate" }
  // Gumroad: { url: "https://api.gumroad.com/v2/licenses/verify", productId: "..." }
  licenseVerify: { url: "", productId: "" },
  perks: [
    "Cloud sync — your space follows you to any device",
    "Every theme, every pet, every future Pro feature",
    "Founding-supporter badge on your Journey",
  ],
};
