// src/libs/fluent-sdk.js
export async function connect() {
  if (!window.fluent) throw new Error("Fluent Wallet not installed");
  await window.fluent.connect();
}

export const wallet = {
  async query(appId, method, args) {
    return await window.fluent.query(appId, method, args);
  },
  async mutate(appId, method, args) {
    return await window.fluent.mutate(appId, method, args);
  },
};
